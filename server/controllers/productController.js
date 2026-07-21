import { parseProductRequest } from "../utils/productParser.js";
import {
  generateUniqueSlug,
  validateCategory,
  validateParsedProduct,
  validateSalePrice,
  validateSKU,
} from "../utils/productValidator.js";
import {
  uploadFeaturedImage,
  uploadGalleryImages,
  uploadVariantImages,
} from "../utils/productUploader.js";
import {
  abortTransaction,
  commitTransaction,
  createProduct,
  endTransaction,
  getAdminProducts,
  getAllProduct,
  getSingleProduct,
  getSingleProductById,
  permanentlyDeleteProductService,
  restoreProduct,
  softDeleteProduct,
  startTransaction,
  toggleProductStatusService,
  updateBasicInformationService,
  updateFeaturedImageService,
  updateGalleryImagesService,
  updateProductInventoryService,
  updateProductPricingService,
  updateVariantImagesService,
} from "../services/ProductServices.js";
import { clearProductCache } from "../redis/cache.js";
import slugify from "slugify";
import logger from "../utils/logger.js";
import { deleteFromCloudinary } from "../configs/cloudinary.js";

export const addToProduct = async (req, res, next) => {
 
  const session = await startTransaction();
  const uploadedPublicIds = [];
  try {
    const data = parseProductRequest(req.body);

    validateParsedProduct(data);

    await validateSKU(data.variants, session);

    validateSalePrice(data.variants);

    await validateCategory(data.category, session);

    const slug = await generateUniqueSlug(data.name, session);

    const featuredImage = await uploadFeaturedImage(
      req.files,
      uploadedPublicIds,
    );

    const productImages = await uploadGalleryImages(
      req.files,
      uploadedPublicIds,
    );

    const finalVariants = await uploadVariantImages(
      req.files,
      data.variants,
      uploadedPublicIds,
    );

    const product = await createProduct(
      {
        ...data,
        slug,
        featuredImage,
        productImages,
        variants: finalVariants,
      },
      session,
    );

    await commitTransaction(session);

    await clearProductCache(data.category);

    return res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (err) {
    await abortTransaction(session);

    // cleanup cloudinary

    next(err);
  } finally {
    await endTransaction(session);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getSingleProduct(slug);
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error(`Get Product Error: ${error.message}`);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getSingleProductById(id);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error(`Get Product Error: ${error.message}`);

    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const result = await getAllProduct(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error(`Get Products Error: ${error.message}`);
    next(error);
  }
};
export const getAdminProductList = async (req, res, next) => {
  try {
    const result = await getAdminProducts(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateBasicInformation = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await updateBasicInformationService({
      id: req.params.id,
      body: req.body,
      session,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Basic information updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const updateProductPricing = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await updateProductPricingService({
      productId: req.params.id,
      body: req.body,
      session,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Pricing updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const updateProductInventory = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await updateProductInventoryService({
      productId: req.params.id,
      body: req.body,
      session,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const updateFeaturedImage = async (req, res, next) => {
  const session = await startTransaction();

  const uploadedPublicIds = [];

  try {
    const product = await updateFeaturedImageService({
      productId: req.params.id,
      files: req.files,
      session,
      uploadedPublicIds,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Featured image updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    await Promise.allSettled(
      uploadedPublicIds.map((id) => deleteFromCloudinary(id)),
    );

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const updateGalleryImages = async (req, res, next) => {
  const session = await startTransaction();

  const uploadedPublicIds = [];

  try {
    const product = await updateGalleryImagesService({
      productId: req.params.id,
      files: req.files,
      session,
      uploadedPublicIds,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    await Promise.allSettled(
      uploadedPublicIds.map((id) => deleteFromCloudinary(id)),
    );

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const updateVariantImages = async (req, res, next) => {
  const session = await startTransaction();

  const uploadedPublicIds = [];

  try {
    const product = await updateVariantImagesService({
      productId: req.params.id,
      body: req.body,
      files: req.files,
      session,
      uploadedPublicIds,
    });

    await commitTransaction(session);

    await clearProductCache(product.category);

    res.status(200).json({
      success: true,
      message: "Variant images updated successfully.",
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    await Promise.allSettled(
      uploadedPublicIds.map((id) => deleteFromCloudinary(id)),
    );

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const toggleProductStatus = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await toggleProductStatusService(req.params.id, session);

    await commitTransaction(session);

    await clearProductCache(product.category);

    return res.status(200).json({
      success: true,
      message: `Product ${
        product.isActive ? "activated" : "deactivated"
      } successfully.`,
      product,
    });
  } catch (error) {
    await abortTransaction(session);

    next(error);
  } finally {
    await endTransaction(session);
  }
};

export const deleteProduct = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await softDeleteProduct(req.params.id, session);

    await commitTransaction(session);

    await clearProductCache(product.category);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    await abortTransaction(session);

    next(err);
  } finally {
    await endTransaction(session);
  }
};

export const restoreDeletedProduct = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await restoreProduct(req.params.id, session);

    await commitTransaction(session);

    await clearProductCache(product.category);

    return res.status(200).json({
      success: true,
      message: "Product restored successfully.",
      product,
    });
  } catch (err) {
    await abortTransaction(session);

    next(err);
  } finally {
    await endTransaction(session);
  }
};

export const getDeletedProducts = async () => {
  return await Product.find({
    isDeleted: true,
  })
    .populate("category")
    .sort({ deletedAt: -1 });
};

export const permanentlyDeleteProduct = async (req, res, next) => {
  const session = await startTransaction();

  try {
    const product = await permanentlyDeleteProductService(
      req.params.id,
      session,
    );

    await commitTransaction(session);

    await clearProductCache(product.category);

    return res.status(200).json({
      success: true,
      message: "Product permanently deleted.",
    });
  } catch (err) {
    await abortTransaction(session);

    next(err);
  } finally {
    await endTransaction(session);
  }
};
