import express from "express";
import {createBuyNowOrder, createCartCheckoutOrder, getOrderByStripeSession, retryOrderPayment } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/buy-now", authMiddleware, createBuyNowOrder);
orderRouter.post("/cart-checkout", authMiddleware, createCartCheckoutOrder);
orderRouter.get("/stripe-session/:sessionId", authMiddleware, getOrderByStripeSession);
orderRouter.post("/:orderId/retry-payment", authMiddleware, retryOrderPayment);

export default orderRouter;