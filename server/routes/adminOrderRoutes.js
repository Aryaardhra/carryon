import express from "express";
import { getAdminOrderById, getAllOrders, updateAdminOrderStatus } from "../controllers/adminOrderController.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const adminOrderRouter = express.Router();

adminOrderRouter.get( "/", authMiddleware, authorizeRoles("admin"), getAllOrders );
adminOrderRouter.get("/:orderId", authMiddleware, authorizeRoles("admin"), getAdminOrderById);
adminOrderRouter.patch("/:orderId/status", authMiddleware, authorizeRoles("admin"), updateAdminOrderStatus);

export default adminOrderRouter;