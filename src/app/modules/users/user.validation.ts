import { z } from "zod"
import { UserRole } from "@prisma/client"

export const createTrainerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
  }),
})

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
})
