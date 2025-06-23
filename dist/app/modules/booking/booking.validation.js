"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        classScheduleId: zod_1.z.string().min(1, "Class schedule ID is required"),
    }),
});
exports.cancelBookingSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Booking ID is required"),
    }),
});
