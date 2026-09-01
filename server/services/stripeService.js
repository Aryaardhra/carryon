import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

export const handleCheckoutCompleted = async (
  session,
) => {
  console.log(
    "Stripe checkout completed:",
    session.id,
  );

  if (session.payment_status !== "paid") {
    console.log(
      "Checkout completed but payment is not paid yet.",
    );

    return;
  }

  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error(
      "Order ID missing from Stripe metadata.",
    );

    return;
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    console.error(
      `Order not found: ${orderId}`,
    );

    return;
  }

  if (order.paymentStatus === "paid") {
    console.log(
      `Order ${order._id} already processed.`,
    );
    return;
  }

  for (const item of order.items) {
   
    const product = await Product.findById(
      item.product,
    );

    if (!product) {
      throw new Error(
        `Product not found: ${item.product}`,
      );
    }

    const variant = product.variants.id(
      item.variantId,
    );

    if (!variant) {
      throw new Error(
        `Variant not found for order ${order._id}`,
      );
    }

    const option = variant.options.find(
      (option) =>
        option.size === item.size,
    );

    if (!option) {
      throw new Error(
        `Size ${item.size} not found for order ${order._id}`,
      );
    }

    if (option.stock < item.quantity) {
      console.error(
        `Insufficient stock for paid order ${order._id}.`,
      );

      order.paymentStatus = "paid";
      order.orderStatus = "pending";

      order.stripePaymentIntentId =
        session.payment_intent || null;

      order.paidAt = order.paidAt || new Date();

      await order.save();

      return;
    }



    option.stock -= item.quantity;

    await product.save();
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";

  order.stripePaymentIntentId =
    session.payment_intent || null;

  order.paidAt = order.paidAt || new Date();

  await order.save();

  await Cart.findOneAndUpdate(
    {
      user: order.user,
    },
    {
      $set: {
        items: [],
      },
    },
  );

  console.log(
    `Order ${order._id} marked as paid and confirmed.`,
  );
};

export const handleCheckoutExpired = async (
  session,
) => {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error(
      "Order ID missing from expired checkout session.",
    );

    return;
  }


  const order = await orderModel.findById(orderId);

  if (!order) {
    console.error(
      `Order not found for expired session: ${orderId}`,
    );

    return;
  }

  if (order.paymentStatus === "paid") {
    return;
  }

  order.paymentStatus = "failed";
  order.orderStatus = "cancelled";

  await order.save();

  console.log(
    `Order ${order._id} marked as failed because Stripe Checkout expired.`,
  );
};

export const handlePaymentFailed = async (
  paymentIntent,
) => {
 

  const orderId =
    paymentIntent.metadata?.orderId;

  if (!orderId) {
    console.error(
      "Order ID missing from failed PaymentIntent metadata.",
    );

    return;
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    console.error(
      `Order not found: ${orderId}`,
    );

    return;
  }

  if (order.paymentStatus === "paid") {
    return;
  }


  order.paymentStatus = "failed";
  order.orderStatus = "cancelled";
  order.stripePaymentIntentId =
    paymentIntent.id;

  await order.save();

  console.log(
    `Payment failed for order ${order._id}.`,
  );
};