import {createBuyNowOrderService, createCartCheckoutOrderService, getOrderByStripeSessionService } from "../services/OrderServices.js";

export const createBuyNowOrder = async (req, res, next) => {
  try {
    const { productId, variantId, size, quantity, addressId } = req.body;

    const userId = req.user._id;

    const result = await createBuyNowOrderService({
      userId,
      productId,
      variantId,
      size,
      quantity,
      addressId,
    });

    return res.status(201).json({
      success: true,
      message: "Checkout session created successfully.",
      order: result.order,
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
    });
  } catch (error) {
    next(error);
  }
};

export const createCartCheckoutOrder = async (req, res, next) => {
  try {
    const { addressId } = req.body;

    const userId = req.user._id;

    const result = await createCartCheckoutOrderService({
      userId,
      addressId,
    });

    return res.status(201).json({
      success: true,
      message: "Cart checkout session created successfully.",

      order: result.order,

      checkoutUrl: result.checkoutUrl,

      sessionId: result.sessionId,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByStripeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Stripe session ID is required.",
      });
    }

    const order = await getOrderByStripeSessionService({
      userId: req.user._id,
      sessionId,
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const retryOrderPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const userId = req.user._id;

    const result = await retryOrderPaymentService({
      orderId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment retry session created successfully.",
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
    });
  } catch (error) {
    next(error);
  }
};
