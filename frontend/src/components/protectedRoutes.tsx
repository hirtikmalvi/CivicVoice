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












// import { Navigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   role: "citizen" | "admin" | "authority";
// }

// interface DecodedToken {
//   user_id: string;
//   role: "citizen" | "admin" | "authority";
//   exp: number;
// }

// // Map roles to their respective login routes
// const loginRoutes: Record<string, string> = {
//   citizen: "/login",
//   admin: "/admin/login",
//   authority: "/authority/login",
// };

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to={loginRoutes[role]} />;
//   }

//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     const now = Math.floor(Date.now() / 1000);

//     if (decoded.exp < now || decoded.role.toLowerCase() !== role) {
//       localStorage.removeItem("token");
//       return <Navigate to={loginRoutes[role]} />;
//     }

//     return <>{children}</>;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     localStorage.removeItem("token");
//     return <Navigate to={loginRoutes[role]} />;
//   }
// };

// export default ProtectedRoute;