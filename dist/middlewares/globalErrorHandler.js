"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../app/error/AppError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errorDetails = error.message;
    // Zod validation errors
    if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation error occurred.";
        errorDetails = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorDetails = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    field: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorDetails = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    field: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    // Prisma errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            statusCode = 409;
            message = "Duplicate entry found.";
            errorDetails = "A record with this information already exists.";
        }
        else if (error.code === "P2025") {
            statusCode = 404;
            message = "Record not found.";
            errorDetails = "The requested record does not exist.";
        }
    }
    // JWT errors
    if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Unauthorized access.";
        errorDetails = "Invalid token.";
    }
    if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Unauthorized access.";
        errorDetails = "Token has expired.";
    }
    console.error("Error:", error);
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorDetails,
    });
};
exports.globalErrorHandler = globalErrorHandler;
