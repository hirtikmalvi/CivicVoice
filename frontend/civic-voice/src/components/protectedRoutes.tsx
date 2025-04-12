import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); // Get role from storage

  if (!role) return <Navigate to="/login" replace />; // Redirect if not logged in
  if (!allowedRoles.includes(role)) return <Navigate to="/not-found" replace />; // Unauthorized access

  return <Outlet />;
};

export default ProtectedRoute;
    