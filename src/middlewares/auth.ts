import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../shared/database";
import AppError from "../app/error/AppError";

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

export const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.authorization?.split(" ")[1]; // Get userId from "Bearer <userId>"

    if (!userId) {
      return next(new AppError(401, "You are unauthorized to access"));
    }

    // Fetch user from MongoDB using Prisma based on the userId passed in the token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

  

    // Check for role-based access control
    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role as UserRole)
    ) {
      return next(
        new AppError(403, "You are not authorized to access this resource")
      );
    }
    req.user = {
      id: user.id,
      role: user?.role as UserRole,
      email: user?.email,
    }; // Set user in the request object
    next();
  };
};
