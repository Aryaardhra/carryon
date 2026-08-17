import stripe from "../configs/stripe.js";
import Cart from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
//import productModel from "../models/productModel.js";
import Product from "../models/productModel.js";
import userModel from "../models/userModel.js";

 // Create a Stripe Checkout Session for Buy Now
 
export const createBuyNowOrderService = async ({
  userId,
  productId,
  variantId,
  size,
  quantity = 1,
  addressId,
}) => {

  // Validate quantity

  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new Error("Invalid quantity.");
  }

  // Find user
 

  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Find shipping address
  
  if (!addressId) {
    throw new Error("Shipping address is required.");
  }

  const shippingAddress = user.addresses.id(addressId);

  if (!shippingAddress) {
    throw new Error("Shipping address not found.");
  }

  // Find product

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    status: "published",
  });

  if (!product) {
    throw new Error("Product not found or unavailable.");
  }

  // Find variant

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new Error("Product variant not found.");
  }

  if (!variant.isActive) {
    throw new Error("This variant is currently unavailable.");
  }
  //  Find selected size
  
  if (!size) {
    throw new Error("Size is required.");
  }

  const option = variant.options.find(
    (item) => item.size === size,
  );

  if (!option) {
    throw new Error("Selected size is not available.");
  }

  // Check stock

  if (option.stock < parsedQuantity) {
    throw new Error(
      `Only ${option.stock} item${
        option.stock === 1 ? "" : "s"
      } available.`,
    );
  }

  //  Determine actual selling price

  const price = Number(option.price);

  const salePrice =
    option.salePrice !== null &&
    option.salePrice !== undefined &&
    option.salePrice !== ""
      ? Number(option.salePrice)
      : null;

  const finalPrice = salePrice ?? price;

  if (!Number.isFinite(finalPrice) || finalPrice <= 0) {
    throw new Error("Invalid product price.");
  }

  //  Calculate total

  const subtotal = finalPrice * parsedQuantity;

  // For now we keep shipping free.
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  // 10. Create order
 
  const order = await orderModel.create({
    user: user._id,

    items: [
      {
        product: product._id,
        variantId: variant._id,
        productName: product.name,
        color: {
          name: variant.color.name,
          hex: variant.color.hex,
        },
        size,
        quantity: parsedQuantity,
        price,
        salePrice,
        image: {
          public_id: variant.images?.[0]?.public_id || "",
          url: variant.images?.[0]?.url || "",
        },
      },
    ],

    shippingAddress: {
      fullName: shippingAddress.fullName,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      phone: shippingAddress.phone,
      pinCode: shippingAddress.pinCode,
    },

    subtotal,
    shippingFee,
    totalAmount,
    paymentMethod: "stripe",
    paymentStatus: "pending",
    orderStatus: "pending",
  });

  // 11. Create Stripe Checkout Session

 const session = await stripe.checkout.sessions.create({
  mode: "payment",

  line_items: [
    {
      price_data: {
        currency: "inr",

        product_data: {
          name: `${product.name} - ${variant.color.name} - ${size}`,
        },

        unit_amount: Math.round(finalPrice * 100),
      },

      quantity: parsedQuantity,
    },
  ],

  metadata: {
    orderId: order._id.toString(),
    userId: user._id.toString(),
  },

  payment_intent_data: {
    metadata: {
      orderId: order._id.toString(),
      userId: user._id.toString(),
    },
  },

  success_url:
    `${process.env.CLIENT_URL}` +
    `/payment-success?session_id={CHECKOUT_SESSION_ID}`,

  cancel_url:
    `${process.env.CLIENT_URL}` +
    `/payment-cancelled?order_id=${order._id}`,
});

  //  Save Stripe session ID

  order.stripeSessionId = session.id;

  await order.save();
  return {
    order,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

export const createCartCheckoutOrderService = async ({
  userId,
  addressId,
}) => {

  if (!addressId) {
    throw new Error("Shipping address is required.");
  }
  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const shippingAddress = user.addresses.id(addressId);

  if (!shippingAddress) {
    throw new Error("Shipping address not found.");
  }

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const orderItems = [];

  let subtotal = 0;
  for (const cartItem of cart.items) {
  
    const product = await Product.findOne({
      _id: cartItem.product,
      isDeleted: false,
      isActive: true,
      status: "published",
    });

    if (!product) {
      throw new Error(
        `Product "${cartItem.product}" is no longer available.`,
      );
    }

    const variant = product.variants.find(
      (item) =>
        item.sku === cartItem.sku &&
        item.isActive,
    );

    if (!variant) {
      throw new Error(
        `${product.name} is no longer available in the selected variant.`,
      );
    }

    const option = variant.options.find(
      (item) => item.size === cartItem.size,
    );

    if (!option) {
      throw new Error(
        `${product.name} - ${cartItem.size} is no longer available.`,
      );
    }

    if (option.stock < cartItem.quantity) {
      throw new Error(
        `Only ${option.stock} ${product.name} (${cartItem.size}) available.`,
      );
    }
    const price = Number(option.price);

    const salePrice =
      option.salePrice !== null &&
      option.salePrice !== undefined &&
      option.salePrice !== ""
        ? Number(option.salePrice)
        : null;

    const finalPrice = salePrice ?? price;

    if (
      !Number.isFinite(finalPrice) ||
      finalPrice <= 0
    ) {
      throw new Error(
        `Invalid price for ${product.name}.`,
      );
    }

    const itemSubtotal =
      finalPrice * cartItem.quantity;

    subtotal += itemSubtotal;

    orderItems.push({
      product: product._id,
      variantId: variant._id,
      productName: product.name,
      color: {
        name: variant.color.name,
        hex: variant.color.hex,
      },
      size: cartItem.size,
      quantity: cartItem.quantity,
      price,
      salePrice,
      image: {
        public_id:
          variant.images?.[0]?.public_id || "",

        url:
          variant.images?.[0]?.url ||
          cartItem.selectedImage ||
          "",
      },
    });
  }

  const shippingFee = 0;
  const totalAmount =
    subtotal + shippingFee;

  const order = await orderModel.create({
    user: user._id,
    items: orderItems,

    shippingAddress: {
      fullName: shippingAddress.fullName,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      phone: shippingAddress.phone,
      pinCode: shippingAddress.pinCode,
    },

    subtotal,
    shippingFee,
    totalAmount,
    paymentMethod: "stripe",
    paymentStatus: "pending",
    orderStatus: "pending",
  });

  const lineItems = orderItems.map(
    (item) => ({
      price_data: {
        currency: "inr",

        product_data: {
          name: `${item.productName} - ${item.color.name} - ${item.size}`,
        },

        unit_amount:
          Math.round(
            (item.salePrice ?? item.price) *
              100,
          ),
      },

      quantity: item.quantity,
    }),
  );

  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      metadata: {
        orderId: order._id.toString(),
        userId: user._id.toString(),
      },

      payment_intent_data: {
       metadata: {
    orderId: order._id.toString(),
    userId: user._id.toString(),
  },
},

      success_url:
        `${process.env.CLIENT_URL}` +
        `/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.CLIENT_URL}/payment-cancelled`,
    });


  order.stripeSessionId = session.id;

  await order.save();

  return {
    order,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};


export const getOrderByStripeSessionService = async ({
  userId,
  sessionId,
}) => {
  if (!sessionId) {
    throw new Error("Stripe session ID is required.");
  }

  const order = await orderModel.findOne({
    user: userId,
    stripeSessionId: sessionId,
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

export const retryOrderPaymentService = async ({
  orderId,
  userId,
}) => {

  const order = await orderModel.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found.");
  }


  if (order.paymentStatus === "paid") {
    throw new Error(
      "This order has already been paid.",
    );
  }

  if (
    order.paymentStatus !== "failed" &&
    order.paymentStatus !== "pending"
  ) {
    throw new Error(
      "This order cannot be paid at this time.",
    );
  }

  if (
    !order.items ||
    order.items.length === 0
  ) {
    throw new Error(
      "This order does not contain any items.",
    );
  }


  const lineItems = [];

  for (const item of order.items) {

    const product = await Product.findOne({
      _id: item.product,
      isDeleted: false,
      isActive: true,
      status: "published",
    });

    if (!product) {
      throw new Error(
        `${item.productName} is no longer available.`,
      );
    }


    // Find the original variant

    const variant =
      product.variants.id(item.variantId);

    if (!variant) {
      throw new Error(
        `${item.productName} variant is no longer available.`,
      );
    }


    if (!variant.isActive) {
      throw new Error(
        `${item.productName} variant is currently unavailable.`,
      );
    }


    // Find original size

    const option =
      variant.options.find(
        (option) =>
          option.size === item.size,
      );

    if (!option) {
      throw new Error(
        `${item.productName} - ${item.size} is no longer available.`,
      );
    }


    if (option.stock < item.quantity) {
      throw new Error(
        `Only ${option.stock} ${item.productName} (${item.size}) available.`,
      );
    }

    const price = Number(option.price);

    const salePrice =
      option.salePrice !== null &&
      option.salePrice !== undefined &&
      option.salePrice !== ""
        ? Number(option.salePrice)
        : null;

  const finalPrice =
  item.salePrice ?? item.price;

if (
  !Number.isFinite(finalPrice) ||
  finalPrice <= 0
) {
  throw new Error(
    `Invalid price for ${item.productName}.`,
  );
}


    lineItems.push({
      price_data: {
        currency: "inr",

        product_data: {
          name:
            `${item.productName} - ` +
            `${variant.color.name} - ` +
            `${item.size}`,
        },

        unit_amount:
          Math.round(finalPrice * 100),
      },

      quantity: item.quantity,
    });
  }

  const session =
  await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: lineItems,

    metadata: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },

    payment_intent_data: {
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    },

    success_url:
      `${process.env.CLIENT_URL}` +
      `/payment-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:
      `${process.env.CLIENT_URL}` +
      `/payment-cancelled?order_id=${order._id}`,
  });


  order.stripeSessionId = session.id;
  order.paymentStatus = "pending";
  order.orderStatus = "pending";
  await order.save();

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};