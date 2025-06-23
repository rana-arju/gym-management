import { UserRole } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
const verifyToken = (token: string, secret: Secret) => {
  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: UserRole;
      iat: number;
      exp: number;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
export { generateToken, verifyToken };
