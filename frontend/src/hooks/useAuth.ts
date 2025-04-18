import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  name: string;
  email: string;
  role: "Citizen" | "admin" | "Authority";
  exp: number; // expiry timestamp
}

export const getUserFromToken = (): DecodedToken | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
