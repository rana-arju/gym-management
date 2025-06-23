"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT || 5000,
    jwt: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRES_IN || "3d",
        jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET,
        jwtRefreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION || "365d",
    },
};
