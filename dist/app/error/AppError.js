"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
