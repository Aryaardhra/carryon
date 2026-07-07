import { validateProduct } from "./productValidation.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import logger from "./logger.js";
import slugify from "slugify";

export const validateParsedProduct = (data) => {
  //const data = { variants, specifications: specs, tags: tagList, highlights: highlightList, seo: seoData, suitableFor};
  const { error } = validateProduct(data);

  if (error) {
    logger.warn(`Validation Error : ${error.details[0].message}`);
    throw new Error(error.details[0].message);
  }
  return true;
};

export const validateParsedProductForUpdate = (data) => {
  if (data.variants) {
    validateSalePrice(data.variants);
  }

  return true;
};

export const validateSKU = async (variants, session, productId = null) => {
  const skuSet = new Set();

  for (const variant of variants) {
    const sku = variant.sku.trim().toUpperCase();

    if (skuSet.has(sku)) {
      logger.warn(`Duplicate SKU in request: ${sku}`);
      throw new Error(`Duplicate SKU '${sku}' found.`);
    }

    skuSet.add(sku);

    const exists = await productModel
      .findOne({
        _id: { $ne: productId },
        "variants.sku": sku,
      })
      .session(session);

    if (exists) {
      logger.warn(`SKU already exists: ${sku}`);
      throw new Error(`SKU '${sku}' already exists.`);
    }
  }

  return true;
};

export const validateCategory = async (category, session) => {
  if (!category) return true;

  const exists = await categoryModel
    .findOne({
      _id: category,
      isActive: true,
    })
    .session(session);

  if (!exists) {
    logger.warn("Category not found.");
    throw new Error("Category not found.");
  }

  return true;
};

export const validateSalePrice = (variants) => {
  if (!variants) return true;

  for (const variant of variants) {
    if (
      variant.salePrice &&
      Number(variant.salePrice) >= Number(variant.price)
    ) {
      logger.warn(`Invalid sale price for SKU ${variant.sku}`);
      throw new Error(`Sale price must be less than price for SKU ${variant.sku}`,);
    }
  }

  return true;
};

export const generateUniqueSlug = async (name, session) => {
  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const exists = await productModel.findOne({ slug }).session(session);

  if (exists) {
    logger.warn("Product already exists.");
    throw new Error("Product already exists.");
  }

  return slug;
};
export const validateUpdateProduct = async ({
  existingProduct,
  data,
  session,
  productId,
}) => {
  validateParsedProductForUpdate(data);

  if (data.variants) {
    await validateSKU(data.variants, session, productId);
    validateSalePrice(data.variants);
  }

  if (data.category) {
    await validateCategory(data.category, session);
  }

  if (data.name && data.name.trim() !== existingProduct.name) {
    return await generateUniqueSlug(data.name, session);
  }
  return existingProduct.slug;
};

export const validateBasicInformation = async ({
  existingProduct,
  body,
  session,
}) => {
  if (body.category && body.category !== existingProduct.category.toString()) {
    await validateCategory(body.category, session);
  }

  let slug = existingProduct.slug;

  if (body.name && body.name.trim() !== existingProduct.name) {
    slug = await generateUniqueSlug(
      body.name,
      session,
    );
  }

  return slug;
};
export const validatePricing = ({ price, salePrice }) => {
  if (price !== undefined && Number(price) <= 0) {
    throw new Error("Price must be greater than zero.");
  }

  if (
    price !== undefined && salePrice !== undefined && Number(salePrice) >= Number(price)) {
    throw new Error("Sale price must be less than price.");
  }
};

export const validateInventory = ({ stock }) => {
  if (stock !== undefined && Number(stock) < 0) {
    throw new Error("Stock cannot be negative.");
  }
};
