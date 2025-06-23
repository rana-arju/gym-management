import bcrypt from "bcrypt";
import type { UserRole } from "@prisma/client";
import prisma from "../../../shared/database";
import { generateToken } from "../../utils/jwt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
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

    const token = generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.jwtSecret as Secret,
      config.jwt.jwtExpiration
    );

    return { user, token };
  },

  async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.jwtSecret as Secret,
      config.jwt.jwtExpiration
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    };

    return { user: userResponse, token };
  },
};
