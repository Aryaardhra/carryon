import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { getMyOrders } from "../services/orderServices";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mt-10">
          My Orders
        </h1>

        <p className="text-gray-500 mt-2">
          View and track your recent orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <Package
            size={48}
            className="text-gray-400 mb-4"
          />

          <h2 className="text-xl font-medium">
            No orders yet
          </h2>

          <p className="text-gray-500 mt-2">
            Your orders will appear here once you make a
            purchase.
          </p>

          <Link
            to="/products"
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl p-5 bg-white"
            >
              {/* Order Header */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Ordered on
                  </p>

                  <p className="font-medium">
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items */}

              <div className="py-5 space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex gap-4"
                  >
                    <img
                      src={item.image?.url}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.color?.name} • {item.size}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="font-medium mt-1">
                        ₹
                        {(
                          item.salePrice ??
                          item.price
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}

              <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus ===
                            "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Payment:{" "}
                    {order.paymentStatus}
                  </span>

                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {order.orderStatus}
                  </span>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border border-black rounded-lg hover:bg-black hover:text-white transition"
                >
                  View Order
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrders;