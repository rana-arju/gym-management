import type { Request } from "express";
import type { UserRole } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  errorDetails?: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
