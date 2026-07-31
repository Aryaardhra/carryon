import { AnimatePresence, motion } from "framer-motion";
import { useCartContext } from "../context/CartContext";

const CartDrawer = () => {
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

  const subtotal = getCartAmount();
  const shippingFee = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.03;
  const total = subtotal + shippingFee + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 220,
            }}
            className="fixed right-0 top-0 h-full w-[360px] bg-white z-50 shadow-xl p-6 overflow-y-auto"
          >
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-5 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-8">Your Cart</h2>

            {cart.items.length === 0 ? (
              <div className="text-center mt-24 text-gray-500">
                Cart is empty.
              </div>
            ) : (
              <div className="space-y-5">
                {cart.items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 border-b pb-5"
                  >
                    <img
                      src={item.variant.selectedImage}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>

                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          {item.variant.color.name}
                        </span>

                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          {item.variant.size}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          {item.variant.salePrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                ₹{item.variant.salePrice}
                              </span>

                              <span className="line-through text-sm text-gray-400">
                                ₹{item.variant.price}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold">
                              ₹{item.variant.price}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => deleteCartItem(item.cartItemId)}
                          className="text-sm text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center mt-4">
                        <button
                          onClick={() =>
                            decrementCartItem(item.cartItemId, item.quantity)
                          }
                          className="w-7 h-7 rounded-full bg-gray-200"
                        >
                          -
                        </button>

                        <span className="px-4">{item.quantity}</span>

                        <button
                          onClick={() =>
                            incrementCartItem(item.cartItemId, item.quantity)
                          }
                          className="w-7 h-7 rounded-full bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-8 border-t pt-6 space-y-3">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{getCartCount()}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-5 border py-3 rounded-lg"
              >
                Clear Cart
              </button>

              <button className="w-full bg-black text-white py-3 rounded-lg mt-3">
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
