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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../../../shared/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createTrainer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield database_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    const trainer = yield database_1.default.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword, role: client_1.UserRole.TRAINER }),
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            createdAt: true,
        },
    });
    return trainer;
});
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, role) {
    const skip = (page - 1) * limit;
    const where = role ? { role } : {};
    const [users, total] = yield Promise.all([
        database_1.default.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        database_1.default.user.count({ where }),
    ]);
    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield database_1.default.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    const updatedUser = yield database_1.default.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield database_1.default.user.findUnique({
        where: { id },
        include: {
            trainedClasses: true,
            bookings: {
                where: {
                    status: "CONFIRMED",
                },
            },
        },
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    // Check if trainer has scheduled classes
    if (existingUser.role === client_1.UserRole.TRAINER &&
        existingUser.trainedClasses.length > 0) {
        throw new Error("Cannot delete trainer with scheduled classes");
    }
    // Check if trainee has confirmed bookings
    if (existingUser.role === client_1.UserRole.TRAINEE &&
        existingUser.bookings.length > 0) {
        throw new Error("Cannot delete trainee with confirmed bookings");
    }
    yield database_1.default.user.delete({
        where: { id },
    });
    return { message: "User deleted successfully" };
});
const getTrainerSchedule = (trainerId_1, ...args_1) => __awaiter(void 0, [trainerId_1, ...args_1], void 0, function* (trainerId, page = 1, limit = 10) {
    const trainer = yield database_1.default.user.findUnique({
        where: { id: trainerId },
    });
    if (!trainer || trainer.role !== client_1.UserRole.TRAINER) {
        throw new Error("Trainer not found");
    }
    const skip = (page - 1) * limit;
    const [classes, total] = yield Promise.all([
        database_1.default.classSchedule.findMany({
            where: { trainerId },
            skip,
            take: limit,
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
            orderBy: {
                date: "asc",
            },
        }),
        database_1.default.classSchedule.count({
            where: { trainerId },
        }),
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
exports.userService = {
    createTrainer,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getTrainerSchedule,
};
