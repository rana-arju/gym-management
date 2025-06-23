import { BookingStatus } from "@prisma/client";
import prisma from "../../../shared/database";

interface CreateBookingData {
  traineeId: string;
  classScheduleId: string;
}
const createBooking = async (data: CreateBookingData) => {
  // Check if class schedule exists
  const classSchedule = await prisma.classSchedule.findUnique({
    where: { id: data.classScheduleId },
    include: {
      _count: {
        select: {
          bookings: {
            where: {
              status: BookingStatus.CONFIRMED,
            },
          },
        },
      },
    },
  });

  if (!classSchedule) {
    throw new Error("Class schedule not found");
  }

  // Check if class is full
  if (classSchedule._count.bookings >= classSchedule.maxTrainees) {
    throw new Error(
      "Class schedule is full. Maximum 10 trainees allowed per schedule."
    );
  }

  // Check if trainee already has a booking for this class
  const existingBooking = await prisma.booking.findUnique({
    where: {
      traineeId_classScheduleId: {
        traineeId: data.traineeId,
        classScheduleId: data.classScheduleId,
      },
    },
  });

  if (existingBooking && existingBooking.status === BookingStatus.CONFIRMED) {
    throw new Error("You have already booked this class");
  }

  // Check for time conflicts with other confirmed bookings
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      traineeId: data.traineeId,
      status: BookingStatus.CONFIRMED,
      classSchedule: {
        OR: [
          {
            AND: [
              { startTime: { lte: classSchedule.startTime } },
              { endTime: { gt: classSchedule.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: classSchedule.endTime } },
              { endTime: { gte: classSchedule.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: classSchedule.startTime } },
              { endTime: { lte: classSchedule.endTime } },
            ],
          },
        ],
      },
    },
  });

  if (conflictingBooking) {
    throw new Error("You cannot book multiple classes in the same time slot");
  }

  // Create or update booking
  const booking = await prisma.booking.upsert({
    where: {
      traineeId_classScheduleId: {
        traineeId: data.traineeId,
        classScheduleId: data.classScheduleId,
      },
    },
    update: {
      status: BookingStatus.CONFIRMED,
      bookedAt: new Date(),
      cancelledAt: null,
    },
    create: {
      traineeId: data.traineeId,
      classScheduleId: data.classScheduleId,
      status: BookingStatus.CONFIRMED,
    },
    include: {
      classSchedule: {
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      trainee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return booking;
};

const getTraineeBookings = async (traineeId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { traineeId },
      skip,
      take: limit,
      include: {
        classSchedule: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        bookedAt: "desc",
      },
    }),
    prisma.booking.count({
      where: { traineeId },
    }),
  ]);

  return {
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllBookings = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      skip,
      take: limit,
      include: {
        classSchedule: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        trainee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        bookedAt: "desc",
      },
    }),
    prisma.booking.count(),
  ]);

  return {
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const cancelBooking = async (
  bookingId: string,
  userId: string,
  userRole: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      trainee: true,
      classSchedule: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Check if user has permission to cancel this booking
  if (userRole !== "ADMIN" && booking.traineeId !== userId) {
    throw new Error("You can only cancel your own bookings");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new Error("Booking is already cancelled");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
    },
    include: {
      classSchedule: {
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      trainee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedBooking;
};
export const bookingService = {
  createBooking,
  getTraineeBookings,
  getAllBookings,
  cancelBooking,
};
