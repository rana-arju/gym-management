import { Router } from "express";
import { userController } from "./user.controller";
import {
  createTrainerSchema,
  updateUserSchema,
  getUserSchema,
} from "./user.validation";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../../middlewares/validation";
import auth from "../../../middlewares/auth";

const router = Router();

// All routes require authentication

// Profile routes (accessible by all authenticated users)
router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  userController.getMyProfile
);
router.put(
  "/profile",
  auth(UserRole.ADMIN, UserRole.TRAINEE, UserRole.TRAINER),
  userController.updateMyProfile
);

// Admin only routes
router.post(
  "/trainers",
  auth(UserRole.ADMIN),
  validateRequest(createTrainerSchema),
  userController.createTrainer
);

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

router.get(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(getUserSchema),
  userController.getUserById
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(getUserSchema),
  userController.deleteUser
);

// Trainer schedule (accessible by admin and the trainer themselves)
router.get(
  "/:id/schedule",
  auth(UserRole.ADMIN, UserRole.TRAINER),
  validateRequest(getUserSchema),
  userController.getTrainerSchedule
);

export const userRoutes = router;
