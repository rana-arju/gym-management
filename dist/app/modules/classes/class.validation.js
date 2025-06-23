"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassSchema = exports.updateClassSchema = exports.createClassSchema = void 0;
const zod_1 = require("zod");
exports.createClassSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().datetime("Invalid date format"),
        startTime: zod_1.z.string().datetime("Invalid start time format"),
        endTime: zod_1.z.string().datetime("Invalid end time format"),
        trainerId: zod_1.z.string().min(1, "Trainer ID is required"),
        maxTrainees: zod_1.z.number().min(1).max(10).optional(),
    }),
});
exports.updateClassSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Class ID is required"),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().datetime().optional(),
        startTime: zod_1.z.string().datetime().optional(),
        endTime: zod_1.z.string().datetime().optional(),
        trainerId: zod_1.z.string().optional(),
        maxTrainees: zod_1.z.number().min(1).max(10).optional(),
    }),
});
exports.getClassSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Class ID is required"),
    }),
});
