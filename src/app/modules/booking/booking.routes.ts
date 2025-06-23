import { Router } from "express"
import { bookingController } from "./booking.controller"

import { createBookingSchema, cancelBookingSchema } from "./booking.validation"
import { UserRole } from "@prisma/client"
import auth  from "../../../middlewares/auth"
import { validateRequest } from "../../../middlewares/validation"

const router = Router()



// Trainee routes
router.post("/", auth(UserRole.TRAINEE), validateRequest(createBookingSchema), bookingController.createBooking)

router.get("/my-bookings", auth(UserRole.TRAINEE), bookingController.getMyBookings)

// Admin routes
router.get("/", auth(UserRole.ADMIN), bookingController.getAllBookings)

// Routes accessible by trainees (own bookings) and admins (all bookings)
router.patch(
  "/:id/cancel",
  auth(UserRole.TRAINEE, UserRole.ADMIN),
  validateRequest(cancelBookingSchema),
  bookingController.cancelBooking,
)

export const bookingRoutes = router
