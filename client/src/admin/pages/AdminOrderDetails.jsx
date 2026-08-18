import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getAdminOrderById, updateAdminOrderStatus } from "../../services/adminOrderService";

const AdminOrderDetails = () => {

  const { orderId } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await getAdminOrderById(orderId);

      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error("Failed to fetch admin order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      setUpdating(true);

      const response = await updateAdminOrderStatus({
        orderId,
        orderStatus: newStatus,
      });

      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);

      alert(error.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mb-3 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Orders
          </button>

          <h1 className="text-2xl font-semibold">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Status */}

        <div>
          <label className="mb-1 block text-sm font-medium">Order Status</label>

          <select
            value={order.orderStatus}
            onChange={handleStatusChange}
            disabled={
              updating ||
              order.orderStatus === "delivered" ||
              order.orderStatus === "cancelled"
            }
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main grid */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}

        <div className="space-y-6 lg:col-span-2">
          {/* Products */}

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Order Items</h2>

            <div className="space-y-5">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 border-b pb-5 last:border-0 last:pb-0"
                >
                  <img
                    src={item.image?.url}
                    alt={item.productName}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Color: {item.color.name}
                    </p>

                    <p className="text-sm text-gray-500">Size: {item.size}</p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="font-medium">
                    ₹
                    {(
                      (item.salePrice ?? item.price) * item.quantity
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Shipping Address</h2>

            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>

              <p>{order.shippingAddress.address}</p>

              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>

              <p>PIN: {order.shippingAddress.pinCode}</p>

              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">
          {/* Payment */}

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Payment</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium uppercase">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Payment Status</span>

                <span className="font-medium capitalize">
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>

                <span>₹{order.shippingFee.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base font-semibold">
                <span>Total</span>

                <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Customer */}

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Customer</h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                {order.user?.name || order.shippingAddress.fullName}
              </p>

              <p>
                <span className="text-gray-500">Email:</span>{" "}
                {order.user?.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
