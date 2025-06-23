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
exports.classService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../../shared/database"));
exports.classService = {
    createClass(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if trainer exists and has TRAINER role
            const trainer = yield database_1.default.user.findUnique({
                where: { id: data.trainerId },
            });
            if (!trainer || trainer.role !== client_1.UserRole.TRAINER) {
                throw new Error("Invalid trainer ID or user is not a trainer");
            }
            // Check daily schedule limit (max 5 classes per day)
            const startOfDay = new Date(data.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(data.date);
            endOfDay.setHours(23, 59, 59, 999);
            const dailyClassCount = yield database_1.default.classSchedule.count({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });
            if (dailyClassCount >= 5) {
                throw new Error("Daily schedule limit exceeded. Maximum 5 classes allowed per day.");
            }
            // Validate class duration (should be 2 hours)
            const startTime = new Date(data.startTime);
            const endTime = new Date(data.endTime);
            const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            if (durationHours !== 2) {
                throw new Error("Each class must be exactly 2 hours long");
            }
            // Check for trainer availability (no overlapping schedules)
            const overlappingClass = yield database_1.default.classSchedule.findFirst({
                where: {
                    trainerId: data.trainerId,
                    OR: [
                        {
                            AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
                        },
                        {
                            AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
                        },
                        {
                            AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
                        },
                    ],
                },
            });
            if (overlappingClass) {
                throw new Error("Trainer is not available at this time slot");
            }
            const classSchedule = yield database_1.default.classSchedule.create({
                data: {
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date),
                    startTime: startTime,
                    endTime: endTime,
                    trainerId: data.trainerId,
                    maxTrainees: data.maxTrainees || 10,
                },
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: "CONFIRMED",
                                },
                            },
                        },
                    },
                },
            });
            return classSchedule;
        });
    },
    getAllClasses() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [classes, total] = yield Promise.all([
                database_1.default.classSchedule.findMany({
                    skip,
                    take: limit,
                    include: {
                        trainer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        _count: {
                            select: {
                                bookings: {
                                    where: {
                                        status: "CONFIRMED",
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        date: "asc",
                    },
                }),
                database_1.default.classSchedule.count(),
            ]);
            return {
                data: classes,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    },
    getClassById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classSchedule = yield database_1.default.classSchedule.findUnique({
                where: { id },
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    bookings: {
                        where: {
                            status: "CONFIRMED",
                        },
                        include: {
                            trainee: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: "CONFIRMED",
                                },
                            },
                        },
                    },
                },
            });
            if (!classSchedule) {
                throw new Error("Class schedule not found");
            }
            return classSchedule;
        });
    },
    updateClass(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingClass = yield database_1.default.classSchedule.findUnique({
                where: { id },
            });
            if (!existingClass) {
                throw new Error("Class schedule not found");
            }
            // If updating trainer, validate trainer exists and has TRAINER role
            if (data.trainerId) {
                const trainer = yield database_1.default.user.findUnique({
                    where: { id: data.trainerId },
                });
                if (!trainer || trainer.role !== client_1.UserRole.TRAINER) {
                    throw new Error("Invalid trainer ID or user is not a trainer");
                }
            }
            const updateData = {};
            if (data.title)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.date)
                updateData.date = new Date(data.date);
            if (data.startTime)
                updateData.startTime = new Date(data.startTime);
            if (data.endTime)
                updateData.endTime = new Date(data.endTime);
            if (data.trainerId)
                updateData.trainerId = data.trainerId;
            if (data.maxTrainees)
                updateData.maxTrainees = data.maxTrainees;
            const updatedClass = yield database_1.default.classSchedule.update({
                where: { id },
                data: updateData,
                include: {
                    trainer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: "CONFIRMED",
                                },
                            },
                        },
                    },
                },
            });
            return updatedClass;
        });
    },
    deleteClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingClass = yield database_1.default.classSchedule.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: "CONFIRMED",
                                },
                            },
                        },
                    },
                },
            });
            if (!existingClass) {
                throw new Error("Class schedule not found");
            }
            if (existingClass._count.bookings > 0) {
                throw new Error("Cannot delete class with existing bookings");
            }
            yield database_1.default.classSchedule.delete({
                where: { id },
            });
            return { message: "Class schedule deleted successfully" };
        });
    },
};
