import { Router } from "express";
import { authController } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.validation";
import { validateRequest } from "../../../middlewares/validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);

export const authRoutes = router;