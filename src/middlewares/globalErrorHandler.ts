import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import AppError from "../app/error/AppError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: any = error.message;

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation error occurred.";
    errorDetails = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorDetails = error?.message
      ? [
          {
            field: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorDetails = error?.message
      ? [
          {
            field: "",
            message: error?.message,
          },
        ]
      : [];
  }
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry found.";

      errorDetails = "A record with this information already exists.";
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Record not found.";
      errorDetails = "The requested record does not exist.";
    }
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized access.";
    errorDetails = "Invalid token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Unauthorized access.";
    errorDetails = "Token has expired.";
  }

  console.error("Error:", error);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
