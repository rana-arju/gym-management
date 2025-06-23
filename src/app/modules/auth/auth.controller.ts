import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { authService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

export const authController = {
    register,login


}
