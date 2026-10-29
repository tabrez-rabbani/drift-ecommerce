import { Router } from "express";
import {
    getMe,
    loginController,
    adminLoginController,
    logOut,
    registerController,
    refreshTokenController,
    googleCallback,
    updateProfile,
    verifyEmailController,
    resendVerificationController,
    forgotPasswordController,
    resetPasswordController,
} from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/authValidator.js";
import { authenticateUser, optionalAuthenticateUser } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, registerValidator, registerController);
authRouter.get("/verify-email", verifyEmailController);
authRouter.post("/resend-verification", authLimiter, resendVerificationController);
authRouter.post("/login", authLimiter, loginValidator, loginController);
authRouter.post("/admin-login", authLimiter, loginValidator, adminLoginController);
authRouter.get("/get-me", optionalAuthenticateUser, getMe);
authRouter.put("/profile", authenticateUser, updateProfile);
authRouter.get("/logout", optionalAuthenticateUser, logOut);
authRouter.get("/refresh-token", refreshTokenController);
authRouter.post("/forgot-password", authLimiter, forgotPasswordController);
authRouter.post("/reset-password", authLimiter, resetPasswordController);

authRouter.get("/google", (req, res, next) => {
    const state = req.query.state || "user";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
        state,
    })(req, res, next);
});

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${config.CLIENT_URL}/account/login?error=google_failed`,
    }),
    googleCallback,
);

export default authRouter;