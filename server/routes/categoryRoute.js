import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import { addCategory, deleteCategory, getActiveCategories, getCategories, getCategory, toggleCategoryStatus, updateCategory } from "../controllers/categorycontroller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", authMiddleware, authorizeRoles("admin"), upload.single("image"), addCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/category", getActiveCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.put("/:id", authMiddleware, authorizeRoles("admin"), upload.single("image"), updateCategory);
categoryRouter.patch("/toggle-status/:id", authMiddleware, authorizeRoles("admin"), toggleCategoryStatus);
categoryRouter.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

export default categoryRouter;