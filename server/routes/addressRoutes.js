import express from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const addressRouter = express.Router();

addressRouter.use(authMiddleware);
addressRouter.get("/", getAddresses);
addressRouter.post("/", addAddress);
addressRouter.put("/:addressId", updateAddress);
addressRouter.delete("/:addressId", deleteAddress);

export default addressRouter;