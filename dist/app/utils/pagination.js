"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const calculatePagination = (options) => {
    const page = options.page ? Number(options.page) : 1;
    const limit = options.limit ? Number(options.limit) : 10;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "asc";
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        sortBy,
        sortOrder,
        skip,
    };
};
exports.paginationHelper = {
    calculatePagination,
};
