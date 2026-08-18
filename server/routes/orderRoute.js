import express from "express";
import { cancelOrder, createBuyNowOrder, createCartCheckoutOrder, getMyOrders, getOrderByStripeSession, getOrderDetails, retryOrderPayment } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/buy-now", authMiddleware, createBuyNowOrder);
orderRouter.post("/cart-checkout", authMiddleware, createCartCheckoutOrder);
orderRouter.get("/stripe-session/:sessionId", authMiddleware, getOrderByStripeSession);
orderRouter.post("/:orderId/retry-payment", authMiddleware, retryOrderPayment);
orderRouter.get(  "/my-orders", authMiddleware, getMyOrders );
orderRouter.get( "/:orderId",authMiddleware, getOrderDetails );
orderRouter.patch("/:orderId/cancel", authMiddleware, cancelOrder );
export default orderRouter;