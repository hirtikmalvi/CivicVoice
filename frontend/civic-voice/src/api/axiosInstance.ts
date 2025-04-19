import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://civicvoice-tau.vercel.app/api', // adjust to your backend route
  withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
