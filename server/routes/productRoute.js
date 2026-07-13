import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addToProduct, deleteProduct, getAllProducts, getProduct, getProductById, permanentlyDeleteProduct, restoreDeletedProduct, updateBasicInformation, updateFeaturedImage, updateGalleryImages, updateProductInventory, updateProductPricing, updateVariantImages } from "../controllers/productController.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import upload from "../middlewares/multer.js";

const productRouter = express.Router();

productRouter.post("/add", authMiddleware, authorizeRoles("admin"), upload.any(), addToProduct);
productRouter.get("/:slug", getProduct);
productRouter.get("/pid/:id", getProductById);
productRouter.get("/", getAllProducts);
productRouter.patch("/:id/basic", authMiddleware, authorizeRoles("admin"), updateBasicInformation);
productRouter.patch("/:id/pricing", authMiddleware, authorizeRoles("admin"), updateProductPricing);
productRouter.patch("/:id/inventory", authMiddleware, authorizeRoles("admin"), updateProductInventory);
productRouter.patch("/:id/variant-images", authMiddleware, authorizeRoles("admin"), upload.any(), updateVariantImages);
productRouter.patch("/:id/featured-image", authMiddleware, authorizeRoles("admin"), upload.any(), updateFeaturedImage);
productRouter.patch("/:id/gallery-images", authMiddleware, authorizeRoles("admin"), upload.any(), updateGalleryImages);
productRouter.delete("/:id", deleteProduct);
productRouter.patch("/restore/:id", restoreDeletedProduct);
productRouter.delete("/permanent/:id", permanentlyDeleteProduct);

export default productRouter;