"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/users/user.routes");
const booking_routes_1 = require("../modules/booking/booking.routes");
const class_routes_1 = require("../modules/classes/class.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/booking",
        route: booking_routes_1.bookingRoutes,
    },
    {
        path: "/classes",
        route: class_routes_1.classRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
