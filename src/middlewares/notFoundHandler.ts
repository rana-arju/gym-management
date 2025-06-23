import type { Request, Response } from "express";
import { sendErrorResponse } from "../shared/sendResponse";

export const notFoundHandler = (req: Request, res: Response) => {
  return sendErrorResponse(
    res,
    404,
    "Route not found.",
    `The requested route ${req.originalUrl} does not exist.`
  );
};

