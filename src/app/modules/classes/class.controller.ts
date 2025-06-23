import type { Response, NextFunction, Request } from "express";
import { classService } from "./class.service";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";

const createClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.createClass(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Class scheduled successfully",
    data: result,
  });
});
const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;

  const result = await classService.getAllClasses(page, limit);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Classes retrieved successfully",
    data: result,
  });
});
const getClassById = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.getClassById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Class retrieved successfully",
    data: result,
  });
});

const updateClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.updateClass(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Class updated successfully",
    data: result,
  });
});

const deleteClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.deleteClass(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
  });
});

export const classController = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
