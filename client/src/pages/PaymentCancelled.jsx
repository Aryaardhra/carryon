import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
          !
        </div>

        <h1 className="mt-6 text-3xl font-semibold">Payment Cancelled</h1>

        <p className="mt-3 text-gray-500">
          Your payment was cancelled. Your order has not been confirmed and you
          have not been charged.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="
              rounded-xl
              border
              border-gray-300
              px-6
              py-3
              font-medium
              transition
              hover:border-black
            "
          >
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="
              rounded-xl
              bg-black
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-gray-800
            "
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
