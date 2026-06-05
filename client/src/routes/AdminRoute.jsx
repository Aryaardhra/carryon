import React, { useState } from "react";
import AdminLayout from "../admin/pages/AdminLayout";
import AdminLogin from "../components/admin/AdminLogin";
import { useAuthContext } from "../context/AuthContext";


const AdminRoute = () => {
  const { isAdmin } = useAuthContext();

  console.log(isAdmin)
  return isAdmin ? <AdminLayout /> : <AdminLogin />;
};

export default AdminRoute;
