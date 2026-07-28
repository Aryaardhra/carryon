import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import logger from "../utils/logger.js";
import { formatCart } from "./cartFormatter.js";

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
    logger.warn("Variant unavailable.");
    throw new Error("Variant unavailable.");
  }

  return variant;
};

const findVariantOption = (variant, size) => {
  if (!size) {
    logger.warn("Size is required.");
    throw new Error("Size is required.");
  }

  const option = variant.options.find(
    (item) => item.size === size.toUpperCase(),
  );

  if (!option) {
    logger.warn("Selected size not found.");
    throw new Error("Selected size not available.");
  }
  return option;
};

const validateStock = (option, quantity) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (option.stock < quantity) {
    throw new Error("Insufficient stock.");
  }
};

const findExistingCartItem = (cart, productId, sku, size) => {
  return cart.items.find(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.sku === sku.trim().toUpperCase() &&
      item.size === size,
  );
};

export const addToCartService = async ({ userId, body, session }) => {
  const { productId, color, size, quantity = 1 } = body;

  // Validation
 
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!color) {
    throw new Error("Color is required.");
  }

  if (!size) {
    throw new Error("Size is required.");
  }

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  // Find product
  const product = await findProduct(productId, session);

  // Find variant by color
  const variant = product.variants.find(
    (v) => v.isActive && v.color.name.toLowerCase() === color.toLowerCase(),
  );

  if (!variant) {
    logger.warn("Selected color not available.");
    throw new Error("Selected color not available.");
  }

  // Find size option
  const option = findVariantOption(variant, size);

  // Validate stock
  validateStock(option, qty);

  // Find or create user cart
  
  const cart = await findUserCart(userId, session);

  // Find existing cart item
  
  const existingItem = findExistingCartItem(
    cart,
    productId,
    variant.color.name,
    option.size,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + qty;

    validateStock(option, newQuantity);

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: product._id,

      // SKU is derived from the variant, not sent by frontend
      sku: variant.sku,

      // Selected size
      size: option.size,

      quantity: qty,

      // Snapshot prices at time of adding to cart
      addedPrice: option.price,
      addedSalePrice: option.salePrice ?? null,
    });
  }

  await cart.save({ session });
  logger.info(
    `Added ${product.name} (${variant.color.name}/${option.size}) to cart.`,
  );
  return await formatCart(cart);
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });
  return await formatCart(cart);
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
    logger.warn("Quantity must be at least 1.");
    throw new Error("Quantity must be at least 1.");
  }

  // Find Cart
  const cart = await Cart.findOne({
    user: userId,
  }).session(session);

  if (!cart) {
    logger.warn("Cart not found.");
    throw new Error("Cart not found.");
  }

  // Find Cart Item
  const cartItem = cart.items.id(cartItemId);

  if (!cartItem) {
    logger.warn("Cart item not found.");
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
    logger.warn("Product not available.");
    throw new Error("Product not available.");
  }

  // Find Variant using SKU
  const variant = product.variants.find(
    (variant) => variant.sku === cartItem.sku && variant.isActive,
  );

  if (!variant) {
    logger.warn("Variant unavailable.");
    throw new Error("Variant unavailable.");
  }

  // Find Size Option
  const option = variant.options.find(
    (option) => option.size === cartItem.size,
  );

  if (!option) {
    logger.warn("Selected size unavailable.");
    throw new Error("Selected size unavailable.");
  }

  // Validate Stock
  if (option.stock < quantity) {
    logger.warn("Insufficient stock.");
    throw new Error("Insufficient stock.");
  }

  // Update Quantity
  cartItem.quantity = Number(quantity);

  await cart.save({ session });

  logger.info(
    `Updated quantity of ${variant.sku} (${cartItem.size}) to ${quantity}`,
  );

  return await formatCart(cart);
};

export const removeCartItemService = async ({ userId, body, session }) => {
  const { cartItemId } = body;

  if (!cartItemId) {
    logger.warn("Cart item id is required.");
    throw new Error("Cart item id is required.");
  }

  // Find Cart
  const cart = await Cart.findOne({
    user: userId,
  }).session(session);

  if (!cart) {
    logger.warn("Cart not found.");
    throw new Error("Cart not found.");
  }

  // Find Item
  const item = cart.items.id(cartItemId);

  if (!item) {
    logger.warn("Cart item not found.");
    throw new Error("Cart item not found.");
  }

  // Remove Item
  item.deleteOne();

  await cart.save({ session });

  logger.info(`Removed cart item ${cartItemId}`);

  return await formatCart(cart);
};

export const clearCartService = async ({ userId, session }) => {
  const cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart) {
    throw new Error("Cart not found.");
  }
  cart.items = [];
  await cart.save({ session });

  logger.info(`Cart cleared for user ${userId}`);
  return await formatCart(cart);
};
