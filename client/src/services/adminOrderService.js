import axiosInstance from "../api/axiosInstance";

export const getAdminOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  orderStatus = "",
  paymentStatus = "",
}) => {
  return await axiosInstance.get("/v1/admin/orders", {
    params: {
      page,
      limit,
      search,
      orderStatus,
      paymentStatus,
    },
  });
};

export const getAdminOrderById = async (
  orderId,
) => {
  return await axiosInstance.get(
    `/v1/admin/orders/${orderId}`,
  );
};

export const updateAdminOrderStatus = async ({
  orderId,
  orderStatus,
}) => {
  return await axiosInstance.patch(
    `/v1/admin/orders/${orderId}/status`,
    {
      orderStatus,
    },
  );
};