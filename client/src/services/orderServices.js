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