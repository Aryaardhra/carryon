import jwt from "jsonwebtoken";
import crypto from "crypto";
import redis from "../configs/redis.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(32).toString("hex");

  await redis.set(
    `refresh:${refreshToken}`,
    userId.toString(),
    "EX",
    7 * 24 * 60 * 60,
  );

  await redis.set(
    `user-refresh:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );

  return refreshToken;
};
