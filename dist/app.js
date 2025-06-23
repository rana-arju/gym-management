"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(limiter);
// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        author: "Mohammad Rana Arju",
        message: "Gym Management System API is running!",
        version: "1.0.0",
        license: "MIT",
        timestamp: new Date().toISOString(),
    });
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
        error: {
            path: req.originalUrl,
            message: "Your requested resource was not found on this server.",
        },
    });
    next();
});
exports.default = app;
