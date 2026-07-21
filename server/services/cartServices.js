import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import logger from "../utils/logger.js";

const findUserCart = async (userId, session) => {
  let cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart) {
    const created = await Cart.create(
      [
        {
          user: userId,
          items: [],
        },
      ],
      { session },
    );
    cart = created[0];
  }
  return cart;
};

const findProduct = async (productId, session) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    status: "published",
  }).session(session);

  if (!product) {
    logger.warn("Product not found.");
    throw new Error("Product not found.");
  }
  return product;
};

const findVariant = (product, sku) => {
  const variant = product.variants.find(
    (item) => item.sku === sku.trim().toUpperCase(),
  );

  if (!variant) {
    logger.warn("Variant not found.");
    throw new Error("Variant not found.");
  }

  if (!variant.isActive) {
    logger.warn("Variant inactive.");
    throw new Error("Variant unavailable.");
  }
  return variant;
};

const validateStock = (variant, quantity) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (variant.stock < quantity) {
    throw new Error("Insufficient stock.");
  }
};

const findExistingCartItem = (cart, productId, sku) => {
  return cart.items.find(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.sku === sku.trim().toUpperCase(),
  );
};

export const addToCartService = async ({ userId, body, session }) => {
  const { productId, sku, quantity = 1 } = body;

  if (!productId) {
    throw new Error("Product ID is required.");
  }
  if (!sku) {
    throw new Error("SKU is required.");
  }

  const product = await findProduct(productId, session);
  const variant = findVariant(product, sku);
  validateStock(variant, quantity);
  const cart = await findUserCart(userId, session);
  const existingItem = findExistingCartItem(cart, productId, sku);

  if (existingItem) {
    const newQuantity = existingItem.quantity + Number(quantity);
    validateStock(variant, newQuantity);
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: product._id,
      sku: variant.sku,
      quantity: Number(quantity),
      addedPrice: variant.price,
      addedSalePrice: variant.salePrice,
      color: variant.color,
      size: variant.size,
    });
  }

  await cart.save({ session });
  logger.info(`Added ${product.name} to cart.`);
  return cart;
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      totalSavings: 0,
    };
  }

  const validItems = [];

  let subtotal = 0;
  let totalSavings = 0;
  let totalQuantity = 0;
  let hasInvalidItems = false;

  for (const item of cart.items) {
    const product = item.product;

    //Product deleted

    if (!product) {
      hasInvalidItems = true;
      continue;
    }

    if (product.isDeleted) {
      hasInvalidItems = true;
      continue;
    }

    if (!product.isActive) {
      hasInvalidItems = true;
      continue;
    }

    if (product.status !== "published") {
      hasInvalidItems = true;
      continue;
    }

    // Find Variant

    const variant = product.variants.find(
      (variant) => variant.sku === item.sku && variant.isActive,
    );

    if (!variant) {
      hasInvalidItems = true;
      continue;
    }

    // Current Price

    const currentPrice = variant.salePrice ?? variant.price;
    const itemTotal = currentPrice * item.quantity;

    // Savings

    let saving = 0;

    if (variant.salePrice) {
      saving = (variant.price - variant.salePrice) * item.quantity;
    }

    subtotal += itemTotal;
    totalSavings += saving;
    totalQuantity += item.quantity;

    // Frontend Response

    validItems.push({
      cartItemId: item._id,
      quantity: item.quantity,
      total: itemTotal,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        featuredImage: product.featuredImage,
        category: product.category,
      },

      variant: {
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        salePrice: variant.salePrice,
        stock: variant.stock,
        images: variant.images,
      },
    });
  }

  // Remove Invalid Items

  if (hasInvalidItems) {
    cart.items = cart.items.filter((item) =>
      validItems.some(
        (valid) => valid.cartItemId.toString() === item._id.toString(),
      ),
    );
    await cart.save();
  }

  //  Response

  return {
    items: validItems,
    totalItems: validItems.length,
    totalQuantity,
    subtotal,
    totalSavings,
  };
};

export const updateCartQuantityService = async ({ userId, body, session }) => {
  const { cartItemId, quantity } = body;

  if (!cartItemId) {
    logger.warn("Cart item id is required.");
    throw new Error("Cart item id is required.");
  }

  if (quantity === undefined) {
    logger.warn("Quantity is required.");
    throw new Error("Quantity is required.");
  }

  if (quantity < 1) {
    logger.warn("Invalid quantity.");
    throw new Error("Quantity must be at least 1.");
  }

  // Find Cart

  const cart = await Cart.findOne({
    user: userId,
  }).session(session);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  // Find Cart Item

  const cartItem = cart.items.id(cartItemId);

  if (!cartItem) {
    throw new Error("Cart item not found.");
  }

  // Find Product

  const product = await Product.findOne({
    _id: cartItem.product,
    isDeleted: false,
    isActive: true,
    status: "published",
  }).session(session);

  if (!product) {
    throw new Error("Product not available.");
  }

  // Find Variant

  const variant = product.variants.find(
    (item) => item.sku === cartItem.sku && item.isActive,
  );

  if (!variant) {
    throw new Error("Variant unavailable.");
  }

  // Validate Stock

  if (variant.stock < quantity) {
    throw new Error("Insufficient stock.");
  }

  // Update Quantity

  cartItem.quantity = Number(quantity);
  await cart.save({ session });
  logger.info(`Updated cart quantity for ${variant.sku}`);
  return cart;
};

export const removeCartItemService = async ({ userId, body, session }) => {
  const { cartItemId } = body;

  if (!cartItemId) {
    logger.warn("Cart item id is required.");
    throw new Error("Cart item id is required.");
  }

  // Find Cart

  const cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart) {
    throw new Error("Cart not found.");
  }

  //Find Item

  const item = cart.items.id(cartItemId);

  if (!item) {
    throw new Error("Cart item not found.");
  }

  // Remove Item

  item.deleteOne();
  await cart.save({ session });
  logger.info(`Cart item removed : ${cartItemId}`);
  return cart;
};
export const clearCartService = async ({ userId, session }) => {
  const cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart) {
    throw new Error("Cart not found.");
  }
  cart.items = [];
  await cart.save({ session });

  logger.info(`Cart cleared for user ${userId}`);
  return cart;
};
