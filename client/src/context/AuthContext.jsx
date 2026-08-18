import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../api/authApi";
import toast from "react-hot-toast";
import { registerLogoutHandler, triggerLogout } from "../services/authServices.";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

   // Load Current User

  const loadUser = async () => {
    try {

      const { data } = await getCurrentUser();
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === "admin");
      
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);

    } finally {
      setLoading(false);
    }
  };

   // Login

  const login = async (formData) => {

    const { data } = await loginUser(formData);
    setUser(data.user);
    setIsAuthenticated(true);
    setIsAdmin(data.user.role === "admin");
    toast.success(data.message);
    return data;
  };

  
  //  Register


  const register = async (formData) => {
    const { data } = await registerUser(formData);
    toast.success(data?.message);
    return data;
  };

   // Logout

const logout = async (callApi = true) => {
  try {
    if (callApi) {
      await triggerLogout();
    }
  } catch (err) {
    console.error("Logout API failed:", err);
  } finally {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);

    navigate("/login", { replace: true });
  }
};

const refreshProfile = async () => {
    const { data } = await getProfile();
    setUser(data.user);
    return data.user;
};

  useEffect(() => {
    registerLogoutHandler(logout);
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        loadUser,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
