// jwtService.ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, JWT_SECRET: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

export const generateTokenResetPassword = (
  userId: string,
  JWT_SECRET: string
): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10m" });
};
export const verifyToken = (
  token: string,
  JWT_SECRET: string
): string | object => {
  return jwt.verify(token, JWT_SECRET);
};
