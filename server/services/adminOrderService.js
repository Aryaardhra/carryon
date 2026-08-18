import orderModel from "../models/orderModel.js";

export const getAllOrdersService = async ({
  page = 1,
  limit = 10,
  search = "",
  orderStatus = "",
  paymentStatus = "",
}) => {
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  // Build filter
  const filter = {};

  // Filter by order status

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }
  // Filter by payment status

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  // Search

  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      {
        "shippingAddress.fullName": searchRegex,
      },
      {
        "shippingAddress.phone": searchRegex,
      },
      {
        "shippingAddress.email": searchRegex,
      },
    ];
  }

  // Get orders

  const [orders, totalOrders] = await Promise.all([
    orderModel
      .find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    orderModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalOrders / limitNumber);

  return {
    orders,
    pagination: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalOrders,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  };
};

export const getAdminOrderByIdService = async (orderId) => {
  const order = await orderModel
    .findById(orderId)
    .populate("user", "name email");

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

export const updateAdminOrderStatusService = async ({
  orderId,
  orderStatus,
}) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    throw new Error("Invalid order status.");
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  // Don't modify already delivered orders

  if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
    throw new Error("A delivered order cannot be changed.");
  }

  // Don't reactivate cancelled orders

  if (order.orderStatus === "cancelled" && orderStatus !== "cancelled") {
    throw new Error("A cancelled order cannot be reactivated.");
  }

  // Don't deliver unpaid orders

  if (orderStatus === "delivered" && order.paymentStatus !== "paid") {
    throw new Error("An unpaid order cannot be marked as delivered.");
  }
  // Don't process unpaid orders

  if (
    ["confirmed", "processing", "shipped", "delivered"].includes(orderStatus) &&
    order.paymentStatus !== "paid"
  ) {
    throw new Error("Only paid orders can move to fulfillment.");
  }

  order.orderStatus = orderStatus;
  await order.save();
  return order;
};
