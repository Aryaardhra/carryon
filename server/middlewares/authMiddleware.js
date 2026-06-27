import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) {
      logger.error("Invalid token ");
      return res.status(400).json({
        success: false,
        message: "Invalid token or not valid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      logger.error("User not found!");
      return res.status(400).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error("Error while verifying token", error);
    res.status(401).send({ message: "Error while verifying token" });
  }
};

export default authMiddleware;
