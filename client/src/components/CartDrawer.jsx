import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartContext } from "../context/CartContext";

const CartDrawer = () => {
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
    getCartCount,
    getCartAmount,
    incrementCartItem,
    decrementCartItem,
    deleteCartItem,
    isCartOpen,
    setIsCartOpen,
  } = useCartContext();

  // CART TOTALS

  const subtotal = Number(getCartAmount() || 0);
  const shippingFee = 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  // CHECKOUT

  const handleCheckout = () => {
    if (!cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Close drawer
    setIsCartOpen(false);

    // Go to checkout page
    navigate("/checkout", {
      state: {
        checkoutType: "cart",
      },
    });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          { /* BACKDROP*/}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-40 bg-black"
          />
           { /* DRAWER*/}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 25,
            }}
            className="
              fixed
              right-0
              top-0
              z-50
              h-full
              w-[380px]
              max-w-[92vw]
              overflow-y-auto
              bg-white
              shadow-2xl
            "
          >
             { /* HEADER*/}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold">Your Cart</h2>

                {cart.items.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-lg
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-black
                "
              >
                ✕
              </button>
            </div>
             { /*EMPTY CART*/}
            {cart.items.length === 0 ? (
              <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🛒
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Your cart is empty
                </h3>

                <p className="mt-2 max-w-xs text-sm text-gray-500">
                  Looks like you haven't added anything to your cart yet.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="
                    mt-6
                    rounded-xl
                    bg-black
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                 { /*CART ITEMS*/}
                <div className="px-6 py-6">
                  <div className="space-y-6">
                    {cart.items.map((item) => {
                      const price = Number(
                        item.variant.salePrice ?? item.variant.price ?? 0,
                      );

                      const itemTotal = price * item.quantity;

                      return (
                        <div
                          key={item.cartItemId}
                          className="
                            flex
                            gap-4
                            border-b
                            border-gray-100
                            pb-6
                          "
                        >
                          {/* PRODUCT IMAGE */}

                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={item.variant.selectedImage}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* PRODUCT DETAILS */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                {item.product.name}
                              </h3>

                              <button
                                type="button"
                                onClick={() => deleteCartItem(item.cartItemId)}
                                className="
                                  shrink-0
                                  text-xs
                                  text-red-500
                                  transition
                                  hover:text-red-700
                                "
                              >
                                Remove
                              </button>
                            </div>

                            {/* COLOR + SIZE */}

                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                                {item.variant.color.name}
                              </span>

                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                                Size: {item.variant.size}
                              </span>
                            </div>

                            {/* PRICE */}

                            <div className="mt-3">
                              {item.variant.salePrice !== null &&
                              item.variant.salePrice !== undefined ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    ₹
                                    {Number(
                                      item.variant.salePrice,
                                    ).toLocaleString("en-IN")}
                                  </span>

                                  <span className="text-xs text-gray-400 line-through">
                                    ₹
                                    {Number(item.variant.price).toLocaleString(
                                      "en-IN",
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-gray-900">
                                  ₹
                                  {Number(item.variant.price).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              )}
                            </div>

                            {/* QUANTITY */}

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-gray-200">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decrementCartItem(
                                      item.cartItemId,
                                      item.quantity,
                                    )
                                  }
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-600
                                    transition
                                    hover:bg-gray-100
                                  "
                                >
                                  −
                                </button>

                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    incrementCartItem(
                                      item.cartItemId,
                                      item.quantity,
                                    )
                                  }
                                  className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-600
                                    transition
                                    hover:bg-gray-100
                                  "
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-sm font-semibold">
                                ₹{itemTotal.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                   { /* SUMMARY*/}
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    <div className="mt-5 space-y-3">
                      {/* TOTAL ITEMS */}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Items</span>

                        <span className="font-medium">{getCartCount()}</span>
                      </div>

                      {/* SUBTOTAL */}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>

                        <span className="font-medium">
                          ₹ {subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* SHIPPING */}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>

                        <span className="font-medium">
                          {shippingFee === 0
                            ? "Free"
                            : `₹${shippingFee.toLocaleString("en-IN")}`}
                        </span>
                      </div>

                      {/* TAX */}

                      {tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax</span>

                          <span className="font-medium">
                            ₹ {tax.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {/* TOTAL */}

                      <div className="flex justify-between border-t pt-4 text-lg font-bold">
                        <span>Total</span>

                        <span>₹ {total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                   { /*CLEAR CART*/}
                  <button
                    type="button"
                    onClick={clearCart}
                    className="
                      mt-6
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      py-3
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                    "
                  >
                    Clear Cart
                  </button>
                   { /* CHECKOUT*/}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="
                      mt-3
                      w-full
                      rounded-xl
                      bg-black
                      py-3.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-gray-800
                    "
                  >
                    Proceed to Checkout
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-400">
                    You can select or add your shipping address on the checkout
                    page.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
