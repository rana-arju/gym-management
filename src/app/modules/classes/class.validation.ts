import { z } from "zod"

export const createClassSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().datetime("Invalid date format"),
    startTime: z.string().datetime("Invalid start time format"),
    endTime: z.string().datetime("Invalid end time format"),
    trainerId: z.string().min(1, "Trainer ID is required"),
    maxTrainees: z.number().min(1).max(10).optional(),
  }),
})

export const updateClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Class ID is required"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    trainerId: z.string().optional(),
    maxTrainees: z.number().min(1).max(10).optional(),
  }),
})

export const getClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Class ID is required"),
  }),
})
