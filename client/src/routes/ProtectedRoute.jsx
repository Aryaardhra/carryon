import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

    const { loading, isAuthenticated } = useAuthContext();

   // Loading User

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
              Loading...
            </div>
        );
    }

  //  Not Logged In

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

   // Logged In
 
    return children;

};

export default ProtectedRoute;