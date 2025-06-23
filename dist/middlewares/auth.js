"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const sendResponse_1 = require("../shared/sendResponse");
const jwt_1 = require("../app/utils/jwt");
const authenticate = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return (0, sendResponse_1.sendErrorResponse)(res, 401, "Unauthorized access.", "Access token is required.");
        }
        const decoded = (0, jwt_1.verifyToken)(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, sendResponse_1.sendErrorResponse)(res, 401, "Unauthorized access.", "Invalid or expired token.");
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 401, "Unauthorized access.", "User not authenticated.");
        }
        if (!roles.includes(req.user.role)) {
            return (0, sendResponse_1.sendErrorResponse)(res, 403, "Unauthorized access.", `You must be ${roles.join(" or ")} to perform this action.`);
        }
        next();
    };
};
exports.authorize = authorize;
