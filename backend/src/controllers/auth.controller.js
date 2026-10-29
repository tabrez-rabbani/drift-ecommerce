import jwt from "jsonwebtoken";
import {
    loginService,
    loginAdminService,
    registerUserService,
    refreshAccessTokenService,
    googleLoginService,
    verifyEmailService,
    resendVerificationService,
    forgotPasswordService,
    resetPasswordService,
} from "../services/auth.service.js";
import { updateRefreshToken } from "../dao/user.dao.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { config } from "../config/config.js";

const isProduction = config.NODE_ENV === "production";

const getCookieOptions = (maxAge) => {
    const options = {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    };
    if (maxAge) options.maxAge = maxAge;
    if (config.COOKIE_DOMAIN) {
        options.domain = config.COOKIE_DOMAIN;
    }
    return options;
};

const accessCookieOptions = getCookieOptions(15 * 60 * 1000); // 15 minutes
const refreshCookieOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days
const clearCookieOptions = getCookieOptions();


const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    isVerified: user.isVerified ?? true,
    createdAt: user.createdAt,
    streetAddress: user.streetAddress || "",
    city: user.city || "",
    state: user.state || "",
    postalCode: user.postalCode || "",
    country: user.country || "",
});

export const registerController = asyncHandler(async (req, res) => {
    const { userResponse } = await registerUserService(req.body);

    res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email to activate your account.",
        user: userResponse,
    });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
    const { token } = req.query;

    try {
        await verifyEmailService(token);
        return res.redirect(`${config.CLIENT_URL}/login?verified=true`);
    } catch {
        return res.redirect(`${config.CLIENT_URL}/login?error=verification_failed`);
    }
});

export const resendVerificationController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await resendVerificationService(email);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken, userResponse } = await loginService(req.body);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: userResponse,
    });
});

export const adminLoginController = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken, userResponse } = await loginAdminService(req.body);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        user: userResponse,
    });
});

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: req.user ? "User fetched successfully" : "Guest session",
        user: req.user ? formatUser(req.user) : null,
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, streetAddress, city, state, postalCode, country, password } = req.body;

    const user = await userModel.findById(req.user._id);
    if (!user) throw new AppError("User not found", 404);

    if (name) user.name = name.trim();
    if (phone !== undefined) {
        const cleanPhone = phone.trim();
        if (cleanPhone) {
            const existingWithPhone = await userModel.findOne({
                phone: cleanPhone,
                _id: { $ne: req.user._id },
            });
            if (existingWithPhone) {
                throw new AppError("This phone number is already registered to another account.", 409);
            }
        }
        user.phone = cleanPhone;
    }
    if (streetAddress !== undefined) user.streetAddress = streetAddress.trim();
    if (city !== undefined) user.city = city.trim();
    if (state !== undefined) user.state = state.trim();
    if (postalCode !== undefined) user.postalCode = postalCode.trim();
    if (country !== undefined) user.country = country.trim();
    if (password && password.trim()) user.password = password;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: formatUser(user),
    });
});

export const logOut = asyncHandler(async (req, res) => {
    if (req.user?._id) {
        await updateRefreshToken(req.user._id, "");
    } else if (req.cookies?.refreshToken) {
        try {
            const decoded = jwt.verify(req.cookies.refreshToken, config.JWT_REFRESH_SECRET);
            if (decoded?.id) {
                await updateRefreshToken(decoded.id, "");
            }
        } catch {
            // Ignore error if refresh token was also expired
        }
    }

    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

export const googleCallback = asyncHandler(async (req, res) => {
    const state = req.query.state || "user";
    const frontendUrl = state === "admin" ? config.ADMIN_URL : config.CLIENT_URL;

    try {
        const { accessToken, refreshToken } = await googleLoginService(req.user, state);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        const redirectPath = state === "admin" ? "/admin?auth=google_success" : "/?auth=google_success";
        res.redirect(`${frontendUrl}${redirectPath}`);
    } catch {
        const errorPath = state === "admin" ? "/admin-login?error=unauthorized" : "/account/login?error=unauthorized";
        res.redirect(`${frontendUrl}${errorPath}`);
    }
});

export const refreshTokenController = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) throw new AppError("Unauthorized access", 401);

    const accessToken = await refreshAccessTokenService(incomingRefreshToken);
    res.cookie("accessToken", accessToken, accessCookieOptions);

    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
    });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});