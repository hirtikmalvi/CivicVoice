import React, { useState } from "react";
import axios from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AuthorityLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!form.email.trim()) {
        toast.error("Email is required");
        setIsSubmitting(false);
        return;
      }

      if (!form.password.trim()) {
        toast.error("Password is required");
        setIsSubmitting(false);
        return;
      }

      if (!emailRegex.test(form.email)) {
        toast.error("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      if (form.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsSubmitting(false);
        return;
      }

      // Make API request
      const response = await axios.post("/api/authority/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Authority login response:", response);
      toast.success(response.data.message || "Authority login successful!");

      // Handle successful login
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/authority/dashboard"); // Redirect to authority dashboard
      }
    } catch (error: any) {
      console.error("Authority login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Authority login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Authority Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="d-grid gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityLogin;
