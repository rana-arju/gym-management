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
exports.bookingService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../../shared/database"));
const createBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if class schedule exists
    const classSchedule = yield database_1.default.classSchedule.findUnique({
        where: { id: data.classScheduleId },
        include: {
            _count: {
                select: {
                    bookings: {
                        where: {
                            status: client_1.BookingStatus.CONFIRMED,
                        },
                    },
                },
            },
        },
    });
    if (!classSchedule) {
        throw new Error("Class schedule not found");
    }
    // Check if class is full
    if (classSchedule._count.bookings >= classSchedule.maxTrainees) {
        throw new Error("Class schedule is full. Maximum 10 trainees allowed per schedule.");
    }
    // Check if trainee already has a booking for this class
    const existingBooking = yield database_1.default.booking.findUnique({
        where: {
            traineeId_classScheduleId: {
                traineeId: data.traineeId,
                classScheduleId: data.classScheduleId,
            },
        },
    });
    if (existingBooking && existingBooking.status === client_1.BookingStatus.CONFIRMED) {
        throw new Error("You have already booked this class");
    }
    // Check for time conflicts with other confirmed bookings
    const conflictingBooking = yield database_1.default.booking.findFirst({
        where: {
            traineeId: data.traineeId,
            status: client_1.BookingStatus.CONFIRMED,
            classSchedule: {
                OR: [
                    {
                        AND: [
                            { startTime: { lte: classSchedule.startTime } },
                            { endTime: { gt: classSchedule.startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: classSchedule.endTime } },
                            { endTime: { gte: classSchedule.endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: classSchedule.startTime } },
                            { endTime: { lte: classSchedule.endTime } },
                        ],
                    },
                ],
            },
        },
    });
    if (conflictingBooking) {
        throw new Error("You cannot book multiple classes in the same time slot");
    }
    // Create or update booking
    const booking = yield database_1.default.booking.upsert({
        where: {
            traineeId_classScheduleId: {
                traineeId: data.traineeId,
                classScheduleId: data.classScheduleId,
            },
        },
        update: {
            status: client_1.BookingStatus.CONFIRMED,
            bookedAt: new Date(),
            cancelledAt: null,
        },
        create: {
            traineeId: data.traineeId,
            classScheduleId: data.classScheduleId,
            status: client_1.BookingStatus.CONFIRMED,
        },
        include: {
            classSchedule: {
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            trainee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return booking;
});
const getTraineeBookings = (traineeId_1, ...args_1) => __awaiter(void 0, [traineeId_1, ...args_1], void 0, function* (traineeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        database_1.default.booking.findMany({
            where: { traineeId },
            skip,
            take: limit,
            include: {
                classSchedule: {
                    include: {
                        trainer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                bookedAt: "desc",
            },
        }),
        database_1.default.booking.count({
            where: { traineeId },
        }),
    ]);
    return {
        data: bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
const getAllBookings = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        database_1.default.booking.findMany({
            skip,
            take: limit,
            include: {
                classSchedule: {
                    include: {
                        trainer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                trainee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                bookedAt: "desc",
            },
        }),
        database_1.default.booking.count(),
    ]);
    return {
        data: bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
const cancelBooking = (bookingId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield database_1.default.booking.findUnique({
        where: { id: bookingId },
        include: {
            trainee: true,
            classSchedule: true,
        },
    });
    if (!booking) {
        throw new Error("Booking not found");
    }
    // Check if user has permission to cancel this booking
    if (userRole !== "ADMIN" && booking.traineeId !== userId) {
        throw new Error("You can only cancel your own bookings");
    }
    if (booking.status === client_1.BookingStatus.CANCELLED) {
        throw new Error("Booking is already cancelled");
    }
    const updatedBooking = yield database_1.default.booking.update({
        where: { id: bookingId },
        data: {
            status: client_1.BookingStatus.CANCELLED,
            cancelledAt: new Date(),
        },
        include: {
            classSchedule: {
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            trainee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return updatedBooking;
});
exports.bookingService = {
    createBooking,
    getTraineeBookings,
    getAllBookings,
    cancelBooking,
};
