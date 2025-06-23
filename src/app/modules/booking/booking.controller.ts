import type { Response, NextFunction, Request } from "express";
import { bookingService } from "./booking.service";
import { AuthenticatedRequest } from "../../../types";
import { sendErrorResponse, sendResponse } from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.createBooking({
    traineeId: req.user!.id,
    classScheduleId: req.body.classScheduleId,
  });
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Class booked successfully",
    data: result,
  });
});
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;

  const result = await bookingService.getTraineeBookings(
    req.user!.id,
    page,
    limit
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My bookings retrieved successfully",
    data: result,
  });
});
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;

  const result = await bookingService.getAllBookings(page, limit);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All bookings retrieved successfully",
    data: result,
  });
});
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.cancelBooking(
    req.params.id,
    req.user!.id,
    req.user!.role
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};
