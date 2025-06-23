import type { Response, NextFunction, Request } from "express"
import type { AuthenticatedRequest } from "@/shared/types"
import { userService } from "./user.service"
import { sendResponse, sendErrorResponse } from "@/shared/utils/response"
import { UserRole } from "@prisma/client"
import catchAsync from "../../../shared/catchAsync"
const createTrainer = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createTrainer(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Trainer created successfully",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const role = req.query.role as UserRole;

  const result = await userService.getAllUsers(page, limit, role);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  })
});
export const userController = {
  createTrainer,
  getAllUsers,
  getUserById
};





  async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.updateUser(req.params.id, req.body)

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: result,
      })
    } catch (error: any) {
      if (error.message === "User not found") {
        return sendErrorResponse(res, 404, error.message)
      }
      next(error)
    }
  },

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteUser(req.params.id)

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: result.message,
      })
    } catch (error: any) {
      if (error.message === "User not found") {
        return sendErrorResponse(res, 404, error.message)
      }
      if (error.message.includes("Cannot delete trainer") || error.message.includes("Cannot delete trainee")) {
        return sendErrorResponse(res, 400, error.message)
      }
      next(error)
    }
  },

  async getTrainerSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10

      const result = await userService.getTrainerSchedule(req.params.id, page, limit)

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Trainer schedule retrieved successfully",
        data: result,
      })
    } catch (error: any) {
      if (error.message === "Trainer not found") {
        return sendErrorResponse(res, 404, error.message)
      }
      next(error)
    }
  },

  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.getUserById(req.user!.id)

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  },

  async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Remove role from update data for non-admin users
      const updateData = { ...req.body }
      if (req.user!.role !== UserRole.ADMIN) {
        delete updateData.role
      }

      const result = await userService.updateUser(req.user!.id, updateData)

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  },
}
export const userContainer = {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  getMyProfile,
  updateMyProfile,
}