import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuthContext();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
