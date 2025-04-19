// src/services/authService.ts
import axiosInstance from "../api/axiosInstance";

interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    fullname: string;
    email: string;
    role: string;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};
