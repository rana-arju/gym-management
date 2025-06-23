import type { Response } from "express";
import { ApiResponse } from "../types";

export const sendResponse = (
  res: Response,
  data: ApiResponse<any>
): Response => {
  return res.status(data.statusCode || 200).json({
    success: data.success,
    statusCode: data.statusCode || 200,
    message: data.message,
    ...(data.data && { data: data.data }),
    ...(data.errorDetails && { errorDetails: data.errorDetails }),
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errorDetails?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errorDetails && { errorDetails }),
  });
};
