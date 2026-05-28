import React, { useState } from "react";
import AdminLayout from "../admin/pages/AdminLayout";
import AdminLogin from "../components/admin/AdminLogin";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  return isAdmin ? <AdminLayout /> : <AdminLogin />;
};

export default AdminRoute;
