import type { Response, NextFunction, Request } from "express";
import { userService } from "./user.service";
import { UserRole } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
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
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});
const getTrainerSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getTrainerSchedule(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Trainer schedule retrieved successfully",
    data: result,
  });
});
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile retrieved successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.user!.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile updated successfully",
    data: result,
  });
});

export const userController = {
  createTrainer,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTrainerSchedule,
  getMyProfile,
  updateMyProfile,
};
