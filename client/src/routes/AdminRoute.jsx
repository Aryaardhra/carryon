import React, { useState } from "react";
import AdminLayout from "../admin/pages/AdminLayout";
import AdminLogin from "../components/admin/AdminLogin";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { loading, isAuthenticated, isAdmin } = useAuthContext();

   // Still checking authentication

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  //  User not logged in


  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

   // Logged in but not admin

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  //  Admin authenticated

  return <Outlet />;
};

export default AdminRoute;
