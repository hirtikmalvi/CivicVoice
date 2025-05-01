import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../hooks/useAuth"; // adjust path as needed
import axios from "../api/axiosInstance"; // custom Axios instance

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = async () => {
      const user = getUserFromToken();

      if (!user || !user.user_id) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`/api/citizen/user/${user.user_id}`);
        const role = res.data?.citizen?.role;

        if (role === "Citizen") {
          navigate("/citizen/dashboard");
        } else if (role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          console.warn("Unknown role", role);
          navigate("/unauthorized"); // fallback route
        }
      } catch (error) {
        console.error("Error fetching user role", error);
        navigate("/login");
      }
    };

    redirectUser();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default Home;
