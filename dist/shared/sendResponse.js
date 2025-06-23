"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    return res.status(data.statusCode || 200).json(Object.assign(Object.assign({ success: data.success, statusCode: data.statusCode || 200, message: data.message }, (data.data && { data: data.data })), (data.errorDetails && { errorDetails: data.errorDetails })));
};
exports.sendResponse = sendResponse;
const sendErrorResponse = (res, statusCode, message, errorDetails) => {
    return res.status(statusCode).json(Object.assign({ success: false, statusCode,
        message }, (errorDetails && { errorDetails })));
};
exports.sendErrorResponse = sendErrorResponse;
