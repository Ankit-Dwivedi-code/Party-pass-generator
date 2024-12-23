import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoutes;
