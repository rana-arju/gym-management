"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorMessages = [
        {
            path: err.path,
            message: err === null || err === void 0 ? void 0 : err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Cast error",
        errorMessages,
    };
};
exports.default = handleCastError;
