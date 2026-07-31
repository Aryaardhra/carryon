import axiosInstance from "../api/axiosInstance";

export const getCart = async () => {
  const { data } = await axiosInstance.get("/v1/cart/");
  return data;
};

// Add To Cart

export const addToCart = async ({ productId, color, size, selectedImage, quantity = 1 }) => {
  const { data } = await axiosInstance.post("/v1/cart/add", {
    productId,
    color,
    size,
    selectedImage,
    quantity,
  });
  return data;
};

// Update Cart Quantity

export const updateCartQuantity = async (cartItemId, quantity) => {
  const { data } = await axiosInstance.patch(`/v1/cart/items/${cartItemId}`, {
    quantity,
  });
  return data;
};

// Remove Cart Item

export const removeCartItem = async (cartItemId) => {
  const { data } = await axiosInstance.delete(`/v1/cart/items/${cartItemId}`);
  return data;
};

// Clear Cart

export const clearCart = async () => {
  const { data } = await axiosInstance.delete("/v1/cart/delete");
  return data;
};
