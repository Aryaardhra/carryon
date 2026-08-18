import { getAdminOrderByIdService, getAllOrdersService, updateAdminOrderStatusService } from "../services/adminOrderService.js";

export const getAllOrders = async (
  req,
  res,
  next,
) => {
  try {
    const {
      page,
      limit,
      search,
      orderStatus,
      paymentStatus,
    } = req.query;

    const result =
      await getAllOrdersService({
        page,
        limit,
        search,
        orderStatus,
        paymentStatus,
      });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (
  req,
  res,
  next,
) => {
  try {
    const { orderId } = req.params;

    const order =
      await getAdminOrderByIdService(orderId);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};
export const updateAdminOrderStatus = async (
  req,
  res,
  next,
) => {
  try {
    const { orderId } = req.params;

    const { orderStatus } = req.body;

    const order =
      await updateAdminOrderStatusService({
        orderId,
        orderStatus,
      });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};