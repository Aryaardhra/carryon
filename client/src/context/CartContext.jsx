import { createContext, useContext, useState } from "react";
import { useProductContext } from "./ProductContext";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const { products } = useProductContext();
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  //addToCart

  const addToCart = (productId, size, color) => {
    const key = `${productId}-${size}-${color}`;

    if (cartItems[key]) {
      toast.success("Product already in cart");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [key]: {
        productId,
        size,
        color,
        quantity: 1,
      },
    }));

    toast.success("Added to cart");
  };
  //increment

  const incrementCartItem = (key) => {
    setCartItems((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity: prev[key].quantity + 1,
      },
    }));
  };

  ///remove single item from cart

  const decrementCartItem = (key) => {
    setCartItems((prev) => {
      if (prev[key].quantity <= 1) {
        const copy = { ...prev };

        delete copy[key];

        return copy;
      }

      return {
        ...prev,
        [key]: {
          ...prev[key],
          quantity: prev[key].quantity - 1,
        },
      };
    });
  };

  //updatequantity

  const updateCartItem = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) => ({
      ...prev,
      [productId]: {
        quantity,
      },
    }));
  };
  //delete item

  const deleteCartItem = (key) => {
    setCartItems((prev) => {
      const copy = { ...prev };

      delete copy[key];

      return copy;
    });
    toast.success("removed from cart");
  };

  const clearCart = () => {
    setCartItems({});
  };

  const getCartCount = () => {
    let count = 0;

    Object.values(cartItems).forEach((item) => {
      count += item.quantity;
    });

    return count;
  };

  const getCartAmount = () => {
    let total = 0;

    Object.values(cartItems).forEach((item) => {
      const product = products.find((p) => p._id === item.productId);

      if (!product) return;

      total += Number(product.offerPrice) * item.quantity;
    });

    return total;
  };

  const value = {
    cartItems,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart,
    getCartCount,
    getCartAmount,
    isCartOpen,
    setIsCartOpen,
    incrementCartItem,
    decrementCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export const useCartContext = () => {
  return useContext(CartContext);
};
