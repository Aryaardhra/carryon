import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) {
      logger.error("Invalid token ");
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      logger.error("User not found!");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error("Error while verifying token", error);
    res.status(401).send({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
