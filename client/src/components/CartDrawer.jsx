import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = ({ isOpen, setIsOpen, cartItems }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[350px] bg-white z-50 shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Your Cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
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
                      <p className="text-sm">{item.name}</p>
                      <p className="font-medium text-sm">₹{item.offerPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
