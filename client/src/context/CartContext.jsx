import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  getCart as getCartAPI,
  addToCart as addToCartAPI,
  updateCartQuantity as updateCartQuantityAPI,
  removeCartItem as removeCartItemAPI,
  clearCart as clearCartAPI,
} from "../services/cartService";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    totalSavings: 0,
  });

  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch Cart
  
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { cart } = await getCartAPI();
      setCart(cart);
    } catch (error) {
      
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add To Cart

 const addToCart = async ({
  productId,
  color,
  size,
  quantity = 1,
}) => {
  
    try {
      const { cart } = await addToCartAPI({
        productId,
        color,
        size,
        quantity,
      });
      setCart(cart);
      toast.success("Added to cart");
      setIsCartOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message ||error.message);
    }
  };

  // Increase Quantity

  const incrementCartItem = async (
    cartItemId,
    currentQuantity
  ) => {
    try {
      const { cart } =
        await updateCartQuantityAPI(
          cartItemId,
          currentQuantity + 1
        );

      setCart(cart);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Decrease Quantity

  const decrementCartItem = async (
    cartItemId,
    currentQuantity
  ) => {
    try {
      if (currentQuantity === 1) {
        await deleteCartItem(cartItemId);
        return;
      }

      const { cart } = await updateCartQuantityAPI( cartItemId, currentQuantity - 1 );
      setCart(cart);
    } catch (error) {
      toast.error(error?.response?.data?.message ||error.message);
    }
  };

  // Update Quantity
 
  const updateCartItem = async (
    cartItemId,
    quantity
  ) => {
    try {
      const { cart } = await updateCartQuantityAPI( cartItemId, quantity );
      setCart(cart);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Remove Item

  const deleteCartItem = async (
    cartItemId
  ) => {
    try {
      const { cart } =
        await removeCartItemAPI(cartItemId);
        setCart(cart);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error?.response?.data?.message ||error.message
      );
    }
  };

  // Clear Cart

  const clearCart = async () => {
    try {
      const { cart } = await clearCartAPI();
      setCart(cart);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error( error?.response?.data?.message || error.message);
    }
  };

  // Helpers

  const getCartCount = () => cart.totalQuantity;

  const getCartAmount = () => cart.subtotal;

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    incrementCartItem,
    decrementCartItem,
    updateCartItem,
    deleteCartItem,
    clearCart,
    getCartCount,
    getCartAmount,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () =>
  useContext(CartContext);