import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multer.js";
import { addToProduct, deleteProduct, getAllProducts, getProduct, getProductById, permanentlyDeleteProduct, restoreDeletedProduct, updateBasicInformation, updateFeaturedImage, updateGalleryImages, updateProductInventory, updateProductPricing, updateVariantImages } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authMiddleware, adminMiddleware, upload.any(), addToProduct);
productRouter.get("/:slug", getProduct);
productRouter.get("/pid/:id", getProductById);
productRouter.get("/", getAllProducts);
productRouter.patch("/:id/basic", authMiddleware, adminMiddleware, updateBasicInformation);
productRouter.patch("/:id/pricing", authMiddleware, adminMiddleware, updateProductPricing);
productRouter.patch("/:id/inventory", authMiddleware, adminMiddleware, updateProductInventory);
productRouter.patch("/:id/variant-images", authMiddleware, adminMiddleware, upload.any(), updateVariantImages);
productRouter.patch("/:id/featured-image", authMiddleware, adminMiddleware, upload.any(), updateFeaturedImage);
productRouter.patch("/:id/gallery-images", authMiddleware, adminMiddleware, upload.any(), updateGalleryImages);
productRouter.delete("/:id", deleteProduct);
productRouter.patch("/restore/:id", restoreDeletedProduct);
productRouter.delete("/permanent/:id", permanentlyDeleteProduct);

export default productRouter;