import { UserRole } from "@prisma/client";
import prisma from "../../../shared/database";
import bcrypt from "bcrypt";
interface CreateTrainerData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface UpdateUserData {
  name?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}

const createTrainer = async (data: CreateTrainerData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const trainer = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: UserRole.TRAINER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  return trainer;
};

const getAllUsers = async (page = 1, limit = 10, role?: UserRole) => {
  const skip = (page - 1) * limit;
  const where = role ? { role } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUser = async (id: string, data: UpdateUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    include: {
      trainedClasses: true,
      bookings: {
        where: {
          status: "CONFIRMED",
        },
      },
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Check if trainer has scheduled classes
  if (
    existingUser.role === UserRole.TRAINER &&
    existingUser.trainedClasses.length > 0
  ) {
    throw new Error("Cannot delete trainer with scheduled classes");
  }

  // Check if trainee has confirmed bookings
  if (
    existingUser.role === UserRole.TRAINEE &&
    existingUser.bookings.length > 0
  ) {
    throw new Error("Cannot delete trainee with confirmed bookings");
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: "User deleted successfully" };
};

const getTrainerSchedule = async (trainerId: string, page = 1, limit = 10) => {
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || trainer.role !== UserRole.TRAINER) {
    throw new Error("Trainer not found");
  }

  const skip = (page - 1) * limit;

  const [classes, total] = await Promise.all([
    prisma.classSchedule.findMany({
      where: { trainerId },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: "CONFIRMED",
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    }),
    prisma.classSchedule.count({
      where: { trainerId },
    }),
  ]);

  return {
    data: classes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const userService = {
  createTrainer,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTrainerSchedule,
};
