import mongoose from "mongoose";
import Product from "../models/productModel.js";
import logger from "../utils/logger.js";
import { clearProductCache } from "../redis/cache.js";
import redis from "../configs/redis.js";
import {replaceFeaturedImage, replaceGalleryImages, replaceVariantImages, uploadFeaturedImage, uploadGalleryImages, } from "../utils/productUploader.js";
import { deleteFromCloudinary } from "../configs/cloudinary.js";
import {parseProductRequest,parseUpdateProductRequest,} from "../utils/productParser.js";
import {
  generateUniqueSlug,
  validateBasicInformation,
  validateCategory,
  validateInventory,
  validateParsedProduct,
  validateParsedProductForUpdate,
  validatePricing,
  validateSalePrice,
  validateSKU,
  validateUpdateProduct,
} from "../utils/productValidator.js";

export const createProduct = async (
  {
    name,
    slug,
    description,
    category,
    brand,
    suitableFor,
    highlights,
    tags,
    specifications,
    seo,
    featuredImage,
    productImages,
    variants,
  },
  session,
) => {
  const [product] = await Product.create(
    [
      {
        name: name.trim(),
        slug,
        description: description?.trim() || "",
        category,
        brand: brand?.trim() || "",
        suitableFor,
        highlights,
        tags,
        specifications,
        seo,
        featuredImage,
        productImages,
        variants,
      },
    ],
    { session },
  );

  return product;
};

await clearProductCache();

export const startTransaction = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

export const commitTransaction = async (session) => {
  await session.commitTransaction();
};

export const abortTransaction = async (session) => {
  if (session?.inTransaction()) {
    await session.abortTransaction();
  }
};

export const endTransaction = async (session) => {
  if (session) {
    session.endSession();
  }
};

export const getSingleProduct = async (slug) => {
  const cacheKey = `product:${slug}`;

  //Check Redis
  const cachedProduct = await redis.get(cacheKey);

  if (cachedProduct) {
    return JSON.parse(cachedProduct);
  }

  // Query MongoDB
  const product = await Product.findOne({
    slug,
    status: "published",
    isDeleted: false,
  }).populate("category", "name slug");

  if (!product) {
    throw new Error("Product not found.");
  }

  // Store in Redis
  await redis.set(cacheKey, JSON.stringify(product), "EX", 600);
  return product;
};

export const getSingleProductById = async (id) => {
  console.log(id);
  const product = await Product.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category", "name slug");

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
};

export const getAllProduct = async (query) => {
  const {
    page = 1,
    limit = 10,
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    sort = "latest",
  } = query;

  // Redis Cache Key
  const cacheKey = `products:${JSON.stringify(query)}`;

  // Check Redis
  const cachedProducts = await redis.get(cacheKey);

  if (cachedProducts) {
    logger.info("Products served from Redis.");
    return JSON.parse(cachedProducts);
  }

  // MongoDB Filters

  const filter = {
    status: "published",
    isDeleted: false,
  };

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (minPrice || maxPrice) {
    filter["variants.price"] = {};

    if (minPrice) {
      filter["variants.price"].$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter["variants.price"].$lte = Number(maxPrice);
    }
  }

  // Sorting

  let sortOption = {};

  switch (sort) {
    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    case "priceLow":
      sortOption = {
        "variants.price": 1,
      };
      break;

    case "priceHigh":
      sortOption = {
        "variants.price": -1,
      };
      break;

    case "nameAsc":
      sortOption = {
        name: 1,
      };
      break;

    case "nameDesc":
      sortOption = {
        name: -1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };
  }

  // Pagination

  const currentPage = Number(page);
  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;

  // Database Queries

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProducts / perPage);

  const response = {
    products,
    currentPage,
    totalPages,
    totalProducts,
    limit: perPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
  // Cache Result

  await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

  logger.info("Products served from MongoDB and cached.");

  return response;
};

export const updateBasicInformationService = async ({ id, body, session }) => {
  const product = await Product.findById(id).session(session);

  if (!product) {
    logger.error("Product not found.");
  }

  const slug = await validateBasicInformation({
    existingProduct: product,
    body,
    session,
  });

  if ("name" in body) {
    product.name = body.name.trim();
  }

  if ("description" in body) {
    product.description = body.description;
  }

  if ("brand" in body) {
    product.brand = body.brand;
  }

  if ("category" in body) {
    product.category = body.category;
  }

  if ("tags" in body) {
    product.tags = body.tags;
  }

  if ("highlights" in body) {
    product.highlights = body.highlights;
  }

  if ("specifications" in body) {
    product.specifications = body.specifications;
  }

  if ("seo" in body) {
    product.seo = body.seo;
  }

  if ("suitableFor" in body) {
    product.suitableFor = body.suitableFor;
  }

  await product.save({
    session,
  });
  console.log("Returning product:", product);
  return product;
};

export const updateProductPricingService = async ({
  productId,
  body,
  session,
}) => {
  const { sku, price, salePrice } = body;

  if (!sku) {
    throw new Error("SKU is required.");
  }

  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  const variant = product.variants.find(
    (item) => item.sku === sku.trim().toUpperCase(),
  );

  if (!variant) {
    throw new Error("Variant not found.");
  }

  validatePricing({
    price,
    salePrice,
  });

  if (price !== undefined) {
    variant.price = Number(price);
  }

  if (salePrice !== undefined) {
    variant.salePrice = salePrice === "" ? null : Number(salePrice);
  }

  await product.save({
    session,
  });

  return product;
};

export const updateProductInventoryService = async ({
  productId,
  body,
  session,
}) => {
  const { sku, stock, isActive } = body;

  if (!sku) {
    throw new Error("SKU is required.");
  }

  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  const variant = product.variants.find(
    (item) => item.sku === sku.trim().toUpperCase(),
  );

  if (!variant) {
    throw new Error("Variant not found.");
  }

  validateInventory({
    stock,
  });

  if (stock !== undefined) {
    variant.stock = Number(stock);
  }

  if (isActive !== undefined) {
    variant.isActive = Boolean(isActive);
  }

  await product.save({
    session,
  });

  return product;
};

export const updateFeaturedImageService = async ({
  productId,
  files,
  session,
  uploadedPublicIds,
}) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  await replaceFeaturedImage(product, files, uploadedPublicIds);

  await product.save({ session });

  return product;
};

export const updateGalleryImagesService = async ({
  productId,
  files,
  session,
  uploadedPublicIds,
}) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  await replaceGalleryImages(product, files, uploadedPublicIds);

  await product.save({ session });

  return product;
};

export const updateVariantImagesService = async ({
  productId,
  body,
  files,
  session,
  uploadedPublicIds,
}) => {
  const { sku } = body;

  if (!sku) {
    throw new Error("SKU is required.");
  }

  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  const variant = product.variants.find(
    (item) => item.sku === sku.trim().toUpperCase(),
  );

  if (!variant) {
    throw new Error("Variant not found.");
  }

  const images = await replaceVariantImages(
    files,

    variant,

    uploadedPublicIds,
  );

  variant.images = images;

  await product.save({
    session,
  });

  return product;
};

export const softDeleteProduct = async (productId, session) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
  }).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  product.isDeleted = true;
  product.deletedAt = new Date();

  await product.save({ session });

  return product;
};

export const restoreProduct = async (productId, session) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: true,
  }).session(session);

  if (!product) {
    throw new Error("Product not found.");
  }

  product.isDeleted = false;
  product.deletedAt = null;

  await product.save({ session });

  return product;
};

export const permanentlyDeleteProductService = async (productId, session) => {
  // Find only soft deleted product
  const product = await Product.findOne({
    _id: productId,
    isDeleted: true,
  }).session(session);

  if (!product) {
    throw new Error("Deleted product not found.");
  }

  //Delete Featured Image

  if (product.featuredImage?.public_id) {
    await deleteFromCloudinary(product.featuredImage.public_id);
  }

  // Delete Gallery Images

  if (product.productImages?.length) {
    await Promise.all(
      product.productImages.map((image) =>
        deleteFromCloudinary(image.public_id),
      ),
    );
  }

  // Delete Variant Images

  const variantImageDeletes = [];

  for (const variant of product.variants) {
    if (!variant.images?.length) continue;

    for (const image of variant.images) {
      variantImageDeletes.push(deleteFromCloudinary(image.public_id));
    }
  }

  await Promise.all(variantImageDeletes);

  // Delete Product Document

  await Product.deleteOne({ _id: productId }, { session });

  return product;
};
