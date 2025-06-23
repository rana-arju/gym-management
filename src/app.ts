import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./app/routes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use("/api/v1", router);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    author: "Mohammad Rana Arju",
    message: "Gym Management System API is running!",
    version: "1.0.0",
    license: "MIT",
    timestamp: new Date().toISOString(),
  });
});
// Error handling middleware
app.use(globalErrorHandler)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    error: {
      path: req.originalUrl,
      message: "Your requested resource was not found on this server.",
    },
  });
  next();
});
export default app;
