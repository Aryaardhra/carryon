import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multer.js";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categorycontroller.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", authMiddleware, adminMiddleware, upload.single("image"), addCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default categoryRouter;