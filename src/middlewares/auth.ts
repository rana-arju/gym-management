import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import AppError from "../app/error/AppError";
import { verifyToken } from "../app/utils/jwt";
import config from "../config";
import { Secret } from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(401, "Unauthorized access.", "No token provided.");
      }

      const verify = verifyToken(token, config.jwt.jwtSecret as Secret);

      if (!verify) {
        throw new AppError(
          401,
          "Unauthorized access.",
          "Invalid or expired token."
        );
      }

      if (roles.length && !roles.includes(verify.role)) {
        throw new AppError(
          403,
          "Unauthorized access.",
          `You must be a ${roles
            .join(" or ")
            .toLowerCase()} to perform this action.`
        );
      }

      req.user = verify;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
