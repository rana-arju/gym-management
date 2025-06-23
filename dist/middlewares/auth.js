"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const database_1 = __importDefault(require("../shared/database"));
const AppError_1 = __importDefault(require("../app/error/AppError"));
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Get userId from "Bearer <userId>"
        if (!userId) {
            return next(new AppError_1.default(401, "You are unauthorized to access"));
        }
        // Fetch user from MongoDB using Prisma based on the userId passed in the token
        const user = yield database_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return next(new AppError_1.default(404, "User not found"));
        }
        // Check for role-based access control
        if (requiredRoles.length &&
            !requiredRoles.includes(user.role)) {
            return next(new AppError_1.default(403, "You are not authorized to access this resource"));
        }
        req.user = {
            id: user.id,
            role: user === null || user === void 0 ? void 0 : user.role,
            email: user === null || user === void 0 ? void 0 : user.email,
        }; // Set user in the request object
        next();
    });
};
exports.auth = auth;
