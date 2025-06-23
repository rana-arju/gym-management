import type { Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";
import { AuthenticatedRequest } from "../types";
import { sendErrorResponse } from "../shared/sendResponse";
import { verifyToken } from "../app/utils/jwt";


export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized access.",
        "Access token is required."
      );
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      401,
      "Unauthorized access.",
      "Invalid or expired token."
    );
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized access.",
        "User not authenticated."
      );
    }

    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        403,
        "Unauthorized access.",
        `You must be ${roles.join(" or ")} to perform this action.`
      );
    }

    next();
  };
};
