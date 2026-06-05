import { createContext, useContext } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {

const value ={}

return(
    <CartContext.Provider
   value={value}
    >
        {children}
    </CartContext.Provider>
);
};
export const useCartContext = () => {
    return useContext(CartContext);
}