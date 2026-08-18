import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminOrders } from "../../services/adminOrderService";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getAdminOrders({
        page,
        limit: 10,
        search,
        orderStatus,
        paymentStatus,
      });

      if (response.data.success) {
        setOrders(response.data.orders);

        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, orderStatus, paymentStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleOrderStatusChange = (e) => {
    setOrderStatus(e.target.value);
    setPage(1);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-indigo-100 text-indigo-700";

      case "shipped":
        return "bg-orange-100 text-orange-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and payments.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer or phone..."
              className="w-full rounded-l-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="rounded-r-lg bg-black px-5 text-white"
          >
            Search
          </button>
        </form>

        {/* Order status */}
        <select
          value={orderStatus}
          onChange={handleOrderStatusChange}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none"
        >
          <option value="">All Order Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment status */}
        <select
          value={paymentStatus}
          onChange={handlePaymentStatusChange}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none"
        >
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-medium">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Items
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Total
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    {/* Order */}
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {order.shippingAddress.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.shippingAddress.phone}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 font-medium">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPaymentStatusClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getOrderStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between border-t px-5 py-4">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
