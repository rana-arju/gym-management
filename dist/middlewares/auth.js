"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../app/error/AppError"));
const jwt_1 = require("../app/utils/jwt");
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.default(401, "Unauthorized: No token provided");
            }
            const verify = (0, jwt_1.verifyToken)(token, config_1.default.jwt.jwtSecret);
            if (!verify || !roles.includes(verify.role)) {
                throw new AppError_1.default(403, "Forbidden: You do not have permission to access this resource");
            }
            req.user = verify;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = auth;
