import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { classRoutes } from "../modules/classes/class.routes";

const router = express.Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/classes",
    route: classRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
