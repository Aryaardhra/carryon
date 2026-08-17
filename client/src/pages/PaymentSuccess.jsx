import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderByStripeSession } from "../services/orderServices";

const PaymentSuccess = () => {
  
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [sessionId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await getOrderByStripeSession(sessionId);

      const data = response?.data;

      if (!data?.success || !data?.order) {
        throw new Error(data?.message || "Unable to retrieve your order.");
      }

      setOrder(data.order);
    } catch (error) {
      console.error("Payment success error:", error);

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to retrieve your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * The Stripe redirect can happen slightly
   * before our webhook finishes processing.
   *
   * Therefore we check the order again.
   */
  useEffect(() => {
    if (!order || order.paymentStatus === "paid") {
      return;
    }

    setCheckingPayment(true);

    const interval = setInterval(async () => {
      try {
        const response = await getOrderByStripeSession(sessionId);

        const updatedOrder = response?.data?.order;

        if (!updatedOrder) {
          return;
        }

        setOrder(updatedOrder);

        if (updatedOrder.paymentStatus === "paid") {
          clearInterval(interval);
          setCheckingPayment(false);
        }
      } catch (error) {
        console.error("Checking payment status error:", error);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [order, sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen px-6 pt-32">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
            ✕
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Invalid Payment Session
          </h1>

          <p className="mt-2 text-gray-500">
            We couldn't find your Stripe payment session.
          </p>

          <Link
            to="/collection"
            className="
              mt-6
              inline-block
              rounded-xl
              bg-black
              px-6
              py-3
              font-medium
              text-white
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen px-6 pt-32">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 p-10 text-center">
          <h1 className="text-2xl font-semibold">Order Not Found</h1>

          <p className="mt-2 text-gray-500">
            We couldn't find an order associated with this payment.
          </p>

          <Link
            to="/collection"
            className="
              mt-6
              inline-block
              rounded-xl
              bg-black
              px-6
              py-3
              font-medium
              text-white
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* =================================
            SUCCESS HEADER
        ================================= */}

        <div className="text-center">
          <div
            className={`
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              text-3xl
              ${
                isPaid
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }
            `}
          >
            {isPaid ? "✓" : "⏳"}
          </div>

          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">
            {isPaid ? "Payment Successful!" : "Payment Received"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            {isPaid
              ? "Thank you for your purchase. Your order has been confirmed."
              : "Your payment was received. We're confirming your order."}
          </p>

          {!isPaid && checkingPayment && (
            <p className="mt-3 text-sm text-gray-400">
              Waiting for payment confirmation...
            </p>
          )}
        </div>

        <div className="mt-12 rounded-3xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <p className="mt-1 font-semibold">#{order._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Status</p>

              <span
                className={`
                  mt-1
                  inline-block
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  font-medium
                  ${
                    isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {isPaid ? "Paid" : "Pending"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Status</p>

              <span className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold">Order Items</h2>

            <div className="mt-6 space-y-5">
              {order.items.map((item, index) => {
                const itemPrice = Number(item.salePrice ?? item.price ?? 0);

                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item._id || `${item.product}-${index}`}
                    className="
                        flex
                        gap-4
                        border-b
                        border-gray-100
                        pb-5
                        last:border-b-0
                      "
                  >
                    {/* IMAGE */}

                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Color: {item.color?.name}
                      </p>

                      <p className="text-sm text-gray-500">Size: {item.size}</p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 font-semibold">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>

              <span>
                ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>

              <span>
                {Number(order.shippingFee || 0) === 0
                  ? "Free"
                  : `₹${Number(order.shippingFee).toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
              <span>Total</span>

              <span>
                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Shipping Address</h2>

          <div className="mt-5 text-sm leading-7 text-gray-600">
            <p className="font-semibold text-gray-900">
              {order.shippingAddress?.fullName}
            </p>

            <p>{order.shippingAddress?.address}</p>

            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pinCode}
            </p>

            <p>Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="
              rounded-2xl
              bg-black
              px-8
              py-4
              text-center
              font-semibold
              text-white
              transition
              hover:bg-gray-800
            "
          >
            View My Orders
          </Link>

          <Link
            to="/collection"
            className="
              rounded-2xl
              border
              border-gray-300
              px-8
              py-4
              text-center
              font-semibold
              transition
              hover:border-black
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
