import React, { useState } from "react";
import axios from "../../api/axiosInstance"; // Your configured axios
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { useNavigate } from "react-router-dom"; // Import for navigation in SPA

const CitizenRegister: React.FC = () => {
  const navigate = useNavigate(); // For SPA navigation
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    adhar_number: "",
    phone_number: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm({
            ...form,
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          });
          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error(
            "Failed to fetch location. Please check your browser permissions."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simple frontend validation
      const adharRegex = /^[2-9][0-9]{11}$/;
      const phoneRegex = /^[6-9][0-9]{9}$/;
      const pinCodeRegex = /^[1-9][0-9]{5}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check for empty fields
      for (const [key, value] of Object.entries(form)) {
        if (!value.trim()) {
          toast.error(
            `${
              key.replace(/_/g, " ").charAt(0).toUpperCase() +
              key.replace(/_/g, " ").slice(1)
            } is required`
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Validate specific fields
      if (!emailRegex.test(form.email)) {
        toast.error("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      if (!adharRegex.test(form.adhar_number)) {
        toast.error(
          "Invalid Aadhar number. It should be 12 digits and not start with 0 or 1."
        );
        setIsSubmitting(false);
        return;
      }

      if (!phoneRegex.test(form.phone_number)) {
        toast.error(
          "Invalid Phone number. It should be 10 digits and start with 6-9."
        );
        setIsSubmitting(false);
        return;
      }

      if (!pinCodeRegex.test(form.pincode)) {
        toast.error(
          "Invalid Pincode. It should be 6 digits and not start with 0."
        );
        setIsSubmitting(false);
        return;
      }

      // Format data according to backend requirements
      const formattedData = {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        role_based_data: {
          adhar_number: form.adhar_number,
          phone_number: form.phone_number,
          city: form.city,
          state: form.state,
          address: form.address,
          pincode: form.pincode,
          latitude: parseFloat(form.latitude) || 0,
          longitude: parseFloat(form.longitude) || 0,
        },
      };

      // Make API request with formatted data
      const response = await axios.post("/api/citizen/register", formattedData);

      console.log("Registration response:", response);
      toast.success(response.data.message || "Registration successful!");

      // Reset form after successful submission
      setForm({
        fullname: "",
        email: "",
        password: "",
        adhar_number: "",
        phone_number: "",
        city: "",
        state: "",
        address: "",
        pincode: "",
        latitude: "",
        longitude: "",
      });

      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again later.";
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
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">
                Citizen Registration
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="fullname" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
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

                  <div className="col-md-6">
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
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="adhar_number" className="form-label">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adhar_number"
                      name="adhar_number"
                      value={form.adhar_number}
                      onChange={handleChange}
                      placeholder="12 digits"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone_number" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone_number"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="10 digits"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="pincode" className="form-label">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="6 digits"
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="latitude" className="form-label">
                      Latitude
                    </label>
                    <input
                      className="form-control"
                      id="latitude"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="longitude" className="form-label">
                      Longitude
                    </label>
                    <input
                      className="form-control"
                      id="longitude"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      readOnly
                      required
                    />
                  </div>

                  <div className="col-12 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-info w-100"
                      onClick={getLocation}
                    >
                      Get Current Location
                    </button>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>
                  </div>

                  <div className="col-12 text-center mt-3">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("./login");
                        }}
                        className="text-decoration-none"
                      >
                        Login here
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenRegister;
