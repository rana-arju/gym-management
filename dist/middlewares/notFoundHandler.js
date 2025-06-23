"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const sendResponse_1 = require("../shared/sendResponse");
const notFoundHandler = (req, res) => {
    return (0, sendResponse_1.sendErrorResponse)(res, 404, "Route not found.", `The requested route ${req.originalUrl} does not exist.`);
};
exports.notFoundHandler = notFoundHandler;
