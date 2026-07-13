import logger from "../utils/logger.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn("Unauthorized access attempt");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Access denied. User ${req.user.email} tried to access ${req.originalUrl}`,
      );

      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

export default authorizeRoles;
