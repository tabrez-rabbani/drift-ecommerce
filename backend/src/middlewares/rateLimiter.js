import rateLimit from "express-rate-limit";

// General limiter — applies to all API routes
// 500 requests per 15 minutes per IP (normal browsing, pagination, etc.)
const baseApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes.",
    },
});

// Strict limiter — only for login and register
// 15 attempts per 15 minutes per IP (prevents brute-force & credential stuffing)
const baseAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login/register attempts, please try again after 15 minutes.",
    },
});

// Dynamically check LOAD_TEST_MODE at request runtime
const apiLimiter = (req, res, next) => {
    if (process.env.LOAD_TEST_MODE === "true") {
        return next();
    }
    return baseApiLimiter(req, res, next);
};

const authLimiter = (req, res, next) => {
    if (process.env.LOAD_TEST_MODE === "true") {
        return next();
    }
    return baseAuthLimiter(req, res, next);
};

export { apiLimiter, authLimiter };
