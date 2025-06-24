"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const client_1 = require("@prisma/client");
const validation_1 = require("../../../middlewares/validation");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = (0, express_1.Router)();
// All routes require authentication
// Profile routes (accessible by all authenticated users)
router.get("/profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.TRAINEE, client_1.UserRole.TRAINER), user_controller_1.userController.getMyProfile);
router.put("/profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.TRAINEE, client_1.UserRole.TRAINER), user_controller_1.userController.updateMyProfile);
// Admin only routes
router.post("/trainers", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(user_validation_1.createTrainerSchema), user_controller_1.userController.createTrainer);
// Admin only routes
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.TRAINER), user_controller_1.userController.getAllUsers);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.TRAINER), (0, validation_1.validateRequest)(user_validation_1.getUserSchema), user_controller_1.userController.getUserById);
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(user_validation_1.updateUserSchema), user_controller_1.userController.updateUser);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(user_validation_1.getUserSchema), user_controller_1.userController.deleteUser);
// Trainer schedule (accessible by admin and the trainer themselves)
router.get("/:id/schedule", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.TRAINER), (0, validation_1.validateRequest)(user_validation_1.getUserSchema), user_controller_1.userController.getTrainerSchedule);
exports.userRoutes = router;
