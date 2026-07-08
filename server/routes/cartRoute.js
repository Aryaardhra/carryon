import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartQuantity } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCart);
cartRouter.patch("/items/:cartItemId", authMiddleware, updateCartQuantity);
cartRouter.delete("/items/:cartItemId", authMiddleware, removeCartItem);
cartRouter.delete("/delete", authMiddleware, clearCart);

export default cartRouter;