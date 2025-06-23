import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../shared/database";
import AppError from "../app/error/AppError";
import { verifyToken } from "../app/utils/jwt";
import config from "../config";
import { Secret } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";
import { sendErrorResponse } from "../shared/sendResponse";

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



const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(401, "Unauthorized: No token provided");
      }
      const verify = verifyToken(token, config.jwt.jwtSecret as Secret);
      
      if (!verify || !roles.includes(verify.role)) {
        throw new AppError(
          403,
          "Forbidden: You do not have permission to access this resource"
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