import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { cancelOrder, getOrderDetails, retryOrderPayment } from "../services/orderServices";
import OrderStatusTimeline from "../components/OrderStatusTimeline";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingPayment, setRetryingPayment] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getOrderDetails(orderId);

      setOrder(response.data.order);
    } catch (error) {
      console.error(
        "Failed to fetch order:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Unable to load order details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?",
  );

  if (!confirmed) {
    return;
  }

  try {
    setCancelling(true);

    const response = await cancelOrder(
      order._id,
    );

    console.log(
      "Cancel order response:",
      response.data,
    );

    // Refresh order details
    await fetchOrder();

  } catch (error) {
    console.error(
      "Cancel order error:",
      error,
    );

    alert(
      error.response?.data?.message ||
        "Unable to cancel order.",
    );
  } finally {
    setCancelling(false);
  }
};

  const handleRetryPayment = async () => {
  try {
    setRetryingPayment(true);

    const response =
      await retryOrderPayment(order._id);

    const checkoutUrl =
      response.data.checkoutUrl;

    if (!checkoutUrl) {
      throw new Error(
        "Stripe checkout URL was not returned.",
      );
    }

    window.location.href = checkoutUrl;
  } catch (error) {
    console.error(
      "Retry payment failed:",
      error,
    );

    alert(
      error.response?.data?.message ||
        "Unable to retry payment.",
    );
  } finally {
    setRetryingPayment(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-5">
          {error || "Order not found."}
        </p>

        <Link
          to="/orders"
          className="px-5 py-2.5 bg-black text-white rounded-lg"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const getPaymentStatusClass = () => {
    if (order.paymentStatus === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (order.paymentStatus === "failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">

      {/* Back */}

      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">
            Order Details
          </h1>

          <p className="text-gray-500 mt-2">
            Order #
            {order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Placed on{" "}
          {new Date(
            order.createdAt,
          ).toLocaleDateString()}
        </div>
      </div>

      {/* Status */}

      <div className="border rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Order Status
            </p>

            <p className="text-lg font-semibold capitalize mt-1">
              {order.orderStatus}
            </p>
          </div>

          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getPaymentStatusClass()}`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/*cancelorder*/}

 {["pending", "confirmed"].includes(order.orderStatus) && (
  <button
    onClick={handleCancelOrder}
    disabled={cancelling}
    className="px-5 py-2.5 rounded-lg border border-red-500 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {cancelling ? "Cancelling..." : "Cancel Order"}
  </button>
)}

      {/*retry-payment*/}

    {order.paymentStatus !== "paid" && (
  <div className="border rounded-xl p-5 mb-6">
    <h2 className="font-semibold">
      {order.paymentStatus === "failed"
        ? "Payment Failed"
        : "Payment Pending"}
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      {order.paymentStatus === "failed"
        ? "Your previous payment was unsuccessful. You can try again."
        : "Your payment has not been completed yet."}
    </p>

    <button
      onClick={handleRetryPayment}
      disabled={retryingPayment}
      className="mt-4 px-5 py-2.5 bg-black text-white rounded-lg disabled:opacity-50"
    >
      {retryingPayment
        ? "Redirecting..."
        : order.paymentStatus === "failed"
          ? "Retry Payment"
          : "Complete Payment"}
    </button>
  </div>
)}
      {/* Order Progress */}

       <div className="mb-6">
       <OrderStatusTimeline
       status={order.orderStatus}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          {/* Products */}

          <div className="border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Package size={20} />

              <h2 className="text-lg font-semibold">
                Items
              </h2>
            </div>

            <div className="space-y-5">
              {order.items.map(
                (item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex gap-4 pb-5 last:pb-0 border-b last:border-0"
                  >
                    <img
                      src={item.image?.url}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Color:{" "}
                        {item.color?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Size: {item.size}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <p className="font-semibold mt-2">
                        ₹
                        {(
                          item.salePrice ??
                          item.price
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Shipping Address */}

          <div className="border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={20} />

              <h2 className="text-lg font-semibold">
                Shipping Address
              </h2>
            </div>

            <div className="text-gray-600 space-y-1">
              <p className="font-medium text-black">
                {order.shippingAddress.fullName}
              </p>

              <p>
                {order.shippingAddress.address}
              </p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                PIN:{" "}
                {order.shippingAddress.pinCode}
              </p>

              <p>
                Phone:{" "}
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">

          {/* Payment Summary */}

          <div className="border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={20} />

              <h2 className="text-lg font-semibold">
                Order Summary
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  ₹
                  {order.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span>
                  {order.shippingFee === 0
                    ? "Free"
                    : `₹${order.shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>

                <span>
                  ₹
                  {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment information */}

          <div className="border rounded-xl p-5">
            <h2 className="font-semibold mb-4">
              Payment Information
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Method
                </span>

                <span className="capitalize">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Status
                </span>

                <span className="capitalize">
                  {order.paymentStatus}
                </span>
              </div>

              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Paid on
                  </span>

                  <span>
                    {new Date(
                      order.paidAt,
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;