import { UserRole } from "@prisma/client";
import prisma from "../../../shared/database";

interface CreateClassData {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerId: string;
  maxTrainees?: number;
}

const createClass = async (data: CreateClassData) => {
  // Check if trainer exists and has TRAINER role
  const trainer = await prisma.user.findUnique({
    where: { id: data.trainerId },
  });

  if (!trainer || trainer.role !== UserRole.TRAINER) {
    throw new Error("Invalid trainer ID or user is not a trainer");
  }

  // Check daily schedule limit (max 5 classes per day)
  const startOfDay = new Date(data.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(data.date);
  endOfDay.setHours(23, 59, 59, 999);

  const dailyClassCount = await prisma.classSchedule.count({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (dailyClassCount >= 5) {
    throw new Error(
      "Daily schedule limit exceeded. Maximum 5 classes allowed per day."
    );
  }

  // Validate class duration (should be 2 hours)
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  const durationHours =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  if (durationHours !== 2) {
    throw new Error("Each class must be exactly 2 hours long");
  }

  // Check for trainer availability (no overlapping schedules)
  const overlappingClass = await prisma.classSchedule.findFirst({
    where: {
      trainerId: data.trainerId,
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    },
  });

  if (overlappingClass) {
    throw new Error("Trainer is not available at this time slot");
  }

  const classSchedule = await prisma.classSchedule.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      startTime: startTime,
      endTime: endTime,
      trainerId: data.trainerId,
      maxTrainees: data.maxTrainees || 10,
    },
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });

  return classSchedule;
};

const getAllClasses = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [classes, total] = await Promise.all([
    prisma.classSchedule.findMany({
      skip,
      take: limit,
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    prisma.classSchedule.count(),
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

const getClassById = async (id: string) => {
  const classSchedule = await prisma.classSchedule.findUnique({
    where: { id },
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      bookings: {
        where: {
          status: "CONFIRMED",
        },
        include: {
          trainee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
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
  });

  if (!classSchedule) {
    throw new Error("Class schedule not found");
  }

  return classSchedule;
};

const updateClass = async (id: string, data: Partial<CreateClassData>) => {
  const existingClass = await prisma.classSchedule.findUnique({
    where: { id },
  });

  if (!existingClass) {
    throw new Error("Class schedule not found");
  }

  // If updating trainer, validate trainer exists and has TRAINER role
  if (data.trainerId) {
    const trainer = await prisma.user.findUnique({
      where: { id: data.trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new Error("Invalid trainer ID or user is not a trainer");
    }
  }

  const updateData: any = {};

  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date) updateData.date = new Date(data.date);
  if (data.startTime) updateData.startTime = new Date(data.startTime);
  if (data.endTime) updateData.endTime = new Date(data.endTime);
  if (data.trainerId) updateData.trainerId = data.trainerId;
  if (data.maxTrainees) updateData.maxTrainees = data.maxTrainees;

  const updatedClass = await prisma.classSchedule.update({
    where: { id },
    data: updateData,
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });

  return updatedClass;
};

const deleteClass = async (id: string) => {
  const existingClass = await prisma.classSchedule.findUnique({
    where: { id },
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
  });

  if (!existingClass) {
    throw new Error("Class schedule not found");
  }

  if (existingClass._count.bookings > 0) {
    throw new Error("Cannot delete class with existing bookings");
  }

  await prisma.classSchedule.delete({
    where: { id },
  });

  return { message: "Class schedule deleted successfully" };
};
export const classService = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
