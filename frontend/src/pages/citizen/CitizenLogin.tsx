import React, { useState } from "react";
import axios from "../../api/axiosInstance"; // Your configured axios
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { useNavigate } from "react-router-dom"; // Import for navigation in SPA

const CitizenLogin: React.FC = () => {
  const navigate = useNavigate(); // For SPA navigation
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission and page reload
    setIsSubmitting(true);

    try {
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check for empty fields
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

      // Validate email format
      if (!emailRegex.test(form.email)) {
        toast.error("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      // Validate password (minimum 6 characters)
      if (form.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsSubmitting(false);
        return;
      }

      // Make API request
      const response = await axios.post("/api/citizen/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Login response:", response);
      toast.success(response.data.message || "Login successful!");

      // Handle successful login (e.g., store token, redirect)
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Use React Router's navigate for SPA navigation
        navigate("/citizen/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Toast Container */}
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
              <h2 className="card-title text-center mb-4">Citizen Login</h2>

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

                <div className="text-center mt-3">
                  {/* <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/citizen/forgot-password");
                    }}
                    className="text-decoration-none"
                  >
                    Forgot password?
                  </a> */}
                </div>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/register");
                      }}
                      className="text-decoration-none"
                    >
                      Register here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;
