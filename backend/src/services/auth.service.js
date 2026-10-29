import crypto from "crypto";
import {
    createUser,
    findUserByEmail,
    findUserByEmailOrPhone,
    updateRefreshToken,
    findUserByIdWithToken,
    findUserByGoogleId,
    createGoogleUser,
} from "../dao/user.dao.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { sendVerificationEmail } from "./mail.service.js";

export const registerUserService = async (userData) => {
    const { name, email, password, phone } = userData;

    const isUserExist = await findUserByEmailOrPhone(email, phone);

    if (isUserExist) {
        const message = isUserExist.email === email
            ? "This email is already registered."
            : "This phone number is already registered.";
        throw new AppError(message, 409);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await createUser({
        name,
        email,
        password,
        phone,
        role: "buyer",
        isVerified: false,
        verificationToken: hashedToken,
        verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
        lastVerificationSentAt: new Date(),
    });

    const verificationUrl = `${config.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;

    try {
        await sendVerificationEmail({ to: email, name, verificationUrl });
    } catch (err) {
        console.error("Failed to send verification email:", err);
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpire;

    return { userResponse };
};

export const verifyEmailService = async (rawToken) => {
    if (!rawToken) {
        throw new AppError("Verification token is missing", 400);
    }

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await userModel.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new AppError("Invalid or expired verification link", 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    return user;
};

export const resendVerificationService = async (email) => {
    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
        throw new AppError("No account found with this email", 404);
    }

    if (user.isVerified) {
        throw new AppError("Account is already verified. Please log in.", 400);
    }

    const COOLDOWN_SECONDS = 60;
    if (user.lastVerificationSentAt) {
        const secondsElapsed = Math.floor((Date.now() - new Date(user.lastVerificationSentAt).getTime()) / 1000);
        if (secondsElapsed < COOLDOWN_SECONDS) {
            const remaining = COOLDOWN_SECONDS - secondsElapsed;
            throw new AppError(`Please wait ${remaining}s before requesting another verification email.`, 429);
        }
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.verificationToken = hashedToken;
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    user.lastVerificationSentAt = new Date();
    await user.save();

    const verificationUrl = `${config.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;
    await sendVerificationEmail({ to: user.email, name: user.name, verificationUrl });

    return { message: "Verification link sent. Please check your inbox." };
};

export const loginService = async (userData) => {
    const { email, password } = userData;

    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new AppError("Invalid credentials", 401);
    }

    if (user.role !== "admin" && user.isVerified === false && !user.googleId) {
        throw new AppError("Please verify your email before logging in. Check your inbox for the activation link.", 403);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(user._id, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { accessToken, refreshToken, userResponse };
};

export const loginAdminService = async (userData) => {
    const { email, password } = userData;

    const user = await findUserByEmail(email);

    // Email not in DB at all
    if (!user) {
        throw new AppError("No admin account found for this email.", 403);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new AppError("Invalid credentials.", 401);
    }

    // Email exists but is a buyer, not admin
    if (user.role !== "admin") {
        throw new AppError("Access Denied. This account does not have admin privileges.", 403);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(user._id, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { accessToken, refreshToken, userResponse };
};


export const refreshAccessTokenService = async (incomingRefreshToken) => {
    let decoded;
    try {
        decoded = jwt.verify(incomingRefreshToken, config.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await findUserByIdWithToken(decoded.id);

    if (!user) {
        throw new AppError("Invalid refresh token", 401);
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new AppError("Refresh token is expired or used", 401);
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
};

export const googleLoginService = async (profile, state = "user") => {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const profilePic = photos?.[0]?.value || "";

    if (!email) {
        throw new AppError("Google account does not provide an email address", 400);
    }

    let user = await findUserByGoogleId(id);

    if (!user) {
        user = await findUserByEmail(email);

        if (user) {
            user.googleId = id;
            user.profilePic = profilePic;
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpire = undefined;
            await user.save();
        } else {
            if (state === "admin") {
                throw new AppError("No admin account found for this email.", 403);
            }

            user = await createGoogleUser({
                name: displayName,
                email,
                googleId: id,
                profilePic,
                role: "buyer",
            });
        }
    } else if (!user.isVerified) {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();
    }

    if (state === "admin" && user.role !== "admin") {
        throw new AppError("Access Denied. You are not an admin.", 403);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(user._id, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { accessToken, refreshToken, userResponse };
};
