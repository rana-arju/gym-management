import { Router } from "express"
import { classController } from "./class.controller"

import { createClassSchema, updateClassSchema, getClassSchema } from "./class.validation"
import { UserRole } from "@prisma/client"
import auth  from "../../../middlewares/auth"
import { validateRequest } from "../../../middlewares/validation"

const router = Router()

// All routes require authentication

// Admin only routes
router.post("/", auth(UserRole.ADMIN), validateRequest(createClassSchema), classController.createClass)

router.put("/:id", auth(UserRole.ADMIN), validateRequest(updateClassSchema), classController.updateClass)

router.delete("/:id", auth(UserRole.ADMIN), validateRequest(getClassSchema), classController.deleteClass)

// Routes accessible by all authenticated users
router.get("/", classController.getAllClasses)
router.get("/:id", validateRequest(getClassSchema), classController.getClassById)

export const classRoutes = router
