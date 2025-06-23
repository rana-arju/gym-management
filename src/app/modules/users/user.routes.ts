import { Router } from "express"
import { userController } from "./user.controller"
import { authenticate, authorize } from "@/shared/middleware/auth"
import { validateRequest } from "@/shared/middleware/validation"
import { createTrainerSchema, updateUserSchema, getUserSchema } from "./user.validation"
import { UserRole } from "@prisma/client"

const router = Router()

// All routes require authentication
router.use(authenticate)

// Profile routes (accessible by all authenticated users)
router.get("/profile", userController.getMyProfile)
router.put("/profile", userController.updateMyProfile)

// Admin only routes
router.post("/trainers", authorize(UserRole.ADMIN), validateRequest(createTrainerSchema), userController.createTrainer)

router.get("/", authorize(UserRole.ADMIN), userController.getAllUsers)

router.get("/:id", authorize(UserRole.ADMIN), validateRequest(getUserSchema), userController.getUserById)

router.put("/:id", authorize(UserRole.ADMIN), validateRequest(updateUserSchema), userController.updateUser)

router.delete("/:id", authorize(UserRole.ADMIN), validateRequest(getUserSchema), userController.deleteUser)

// Trainer schedule (accessible by admin and the trainer themselves)
router.get(
  "/:id/schedule",
  authorize(UserRole.ADMIN, UserRole.TRAINER),
  validateRequest(getUserSchema),
  userController.getTrainerSchedule,
)

export default router
