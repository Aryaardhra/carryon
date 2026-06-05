import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [user, setUser] = useState(null);

  const value = { isAdmin, setIsAdmin, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
