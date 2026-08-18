import axiosInstance from "../api/axiosInstance";

export const createBuyNowOrder = async ({
  productId,
  variantId,
  size,
  quantity,
  addressId,
}) => {
  return await axiosInstance.post("v1/orders/buy-now", {
    productId,
    variantId,
    size,
    quantity,
    addressId,
  });
};

export const createCartCheckout = async ({
  addressId,
}) => {
  return await axiosInstance.post(
    "v1/orders/cart-checkout",
    {
      addressId,
    },
  );
};

export const getOrderByStripeSession = async (sessionId) => {
  return await axiosInstance.get(
    `/v1/orders/stripe-session/${sessionId}`
  );
};

export const getMyOrders = async () => {
  return await axiosInstance.get(
    "v1/orders/my-orders",
  );
};

export const getOrderDetails = async (orderId) => {
  return await axiosInstance.get(
    `v1/orders/${orderId}`,
  );
};


export const retryOrderPayment = async (orderId) => {
  return await axiosInstance.post(
    `/v1/orders/${orderId}/retry-payment`,
  );
};

export const cancelOrder = async (orderId) => {
  return await axiosInstance.patch(
    `/v1/orders/${orderId}/cancel`,
  );
};