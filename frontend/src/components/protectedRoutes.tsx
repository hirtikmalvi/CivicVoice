import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactElement;
  //   allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const token = Cookies.get("token");
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
