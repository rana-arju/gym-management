"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const client_1 = require("@prisma/client");
const auth_1 = require("../../../middlewares/auth");
const validation_1 = require("../../../middlewares/validation");
const router = (0, express_1.Router)();
// Trainee routes
router.post("/", (0, auth_1.auth)(client_1.UserRole.TRAINEE), (0, validation_1.validateRequest)(booking_validation_1.createBookingSchema), booking_controller_1.bookingController.createBooking);
router.get("/my-bookings", (0, auth_1.auth)(client_1.UserRole.TRAINEE), booking_controller_1.bookingController.getMyBookings);
// Admin routes
router.get("/", (0, auth_1.auth)(client_1.UserRole.ADMIN), booking_controller_1.bookingController.getAllBookings);
// Routes accessible by trainees (own bookings) and admins (all bookings)
router.patch("/:id/cancel", (0, auth_1.auth)(client_1.UserRole.TRAINEE, client_1.UserRole.ADMIN), (0, validation_1.validateRequest)(booking_validation_1.cancelBookingSchema), booking_controller_1.bookingController.cancelBooking);
exports.bookingRoutes = router;
