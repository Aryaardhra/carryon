import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "../context/CartContext";
import { useProductContext } from "../context/ProductContext";

const CartDrawer = () => {
  const { products } = useProductContext();
  const {
    cartItems,
    setCartItems,
    addToCart,
    clearCart,
    getCartCount,
    getCartAmount,
    deleteCartItem,
    isCartOpen,
    setIsCartOpen,
    incrementCartItem,
    decrementCartItem,
  } = useCartContext();

  const cartProducts = Object.entries(cartItems)
    .map(([cartKey, cart]) => {
      const product = products.find((p) => p._id === cart.productId);

      if (!product) return null;

      return {
        ...product,
        cartKey,
        quantity: cart.quantity,
        size: cart.size,
        color: cart.color,
      };
    })
    .filter(Boolean);

  const subtotal = getCartAmount();
  const shippingFee = 50;
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
            transition={{ type: "spring", stiffness: 200 }}
            className="
            fixed right-0 top-0
            h-full w-[350px]
            bg-white z-50 shadow-xl p-6
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent"
          >
            <h2 className="text-xl font-semibold mb-6">Your Cart</h2>

            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4"
            >
              ✕
            </button>
            {cartProducts.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cartProducts.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <img
                      src={
                        Array.isArray(item.image) ? item.image[0] : item.image
                      }
                      className="w-14 h-14 object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>
                      <div className="flex-1">
                        <span className="px-2 py-0.5 text-[10px] bg-gray-100 rounded-full text-gray-600">
                          {item.size}
                        </span>

                        <span className="px-2 py-0.5 text-[10px] bg-gray-100 rounded-full text-gray-600">
                          {item.color}
                        </span>
                      </div>

                      <p className="font-medium text-sm mt-1">
                        ₹{item.offerPrice}
                      </p>
                    </div>

                    <div className="flex flex-row md:justify-start justify-end items-center mt-2">
                      <button
                        onClick={() => decrementCartItem(item.cartKey)}
                        className="size-6 flex items-center justify-center px-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white ml-8"
                      >
                        -
                      </button>
                      <span className="px-2 text-center mx-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementCartItem(item.cartKey)}
                        className="size-6 flex items-center justify-center px-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
                      >
                        +
                      </button>
                      <div className="ml-5">
                        <span
                          onClick={(e) => deleteCartItem(item.cartKey)}
                          className="text-gray-600 hover:text-gray-800 mr-4"
                        >
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t pt-14">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{getCartCount()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Subtotal:</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Shipping Fee:</span>
                <span>₹ {shippingFee}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Tax (3%):</span>
                <span>₹ {tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mt-2 font-semibold text-lg">
                <span>Total Amount:</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={clearCart}
                className="w-full mt-4 border border-gray-500 text-gray-500 py-2 rounded"
              >
                Clear Cart
              </button>
            </div>

            <button className="w-full mt-8 bg-black text-white py-3 rounded">
              Checkout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
