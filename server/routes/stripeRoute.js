import express from "express";
import { stripeWebhook } from "../controllers/stripeController.js";

const stripeRouter = express.Router();

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default stripeRouter;