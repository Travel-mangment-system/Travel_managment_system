import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Assuming your backend sends a role (e.g., 'PROVIDER', 'CUSTOMER', 'ADMIN') upon login
  const userRole =
    localStorage.getItem("role") || localStorage.getItem("userType");

  // 1. If there is no token, the user is not logged in. Send to Login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route requires specific roles and the user doesn't have it.
  if (allowedRoles && !allowedRoles.includes(userRole?.toUpperCase())) {
    // Redirect to home/search page if a customer tries to access the provider panel
    return <Navigate to="/buses" replace />;
  }

  // 3. If logged in and authorized, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;
