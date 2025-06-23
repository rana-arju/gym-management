import { z } from "zod"

export const createBookingSchema = z.object({
  body: z.object({
    classScheduleId: z.string().min(1, "Class schedule ID is required"),
  }),
})

export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Booking ID is required"),
  }),
})
