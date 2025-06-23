"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRoutes = void 0;
const express_1 = require("express");
const class_controller_1 = require("./class.controller");
const class_validation_1 = require("./class.validation");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validation_1 = require("../../../middlewares/validation");
const router = (0, express_1.Router)();
// All routes require authentication
// Admin only routes
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(class_validation_1.createClassSchema), class_controller_1.classController.createClass);
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(class_validation_1.updateClassSchema), class_controller_1.classController.updateClass);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(class_validation_1.getClassSchema), class_controller_1.classController.deleteClass);
// Routes accessible by all authenticated users
router.get("/", class_controller_1.classController.getAllClasses);
router.get("/:id", (0, validation_1.validateRequest)(class_validation_1.getClassSchema), class_controller_1.classController.getClassById);
exports.classRoutes = router;
