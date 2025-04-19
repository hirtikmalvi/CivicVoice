import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  fullname: string;
  email: string;
  password: string;
  role: "Citizen" | "Authority";
  role_based_data: any;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    fullname: "",
    email: "",
    password: "",
    role: "Citizen",
    role_based_data: {},
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "adhar_number",
        "phone_number",
        "city",
        "state",
        "address",
        "pincode",
        "latitude",
        "longitude",
        "zone",
        "department",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        role_based_data: {
          ...prev.role_based_data,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Handle Register user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    }
  };
  // Get Location of citizen
  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          role_based_data: {
            ...prev.role_based_data,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
      },
      (error) => {
        console.error(error);
        alert("Failed to retrieve location");
      }
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Register</h2>
      <form
        className="w-50 mx-auto border p-4 shadow rounded"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            name="fullname"
            required
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            required
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            required
            minLength={7}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="Citizen">Citizen</option>
            <option value="Authority">Authority</option>
          </select>
        </div>

        {formData.role === "Citizen" && (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Aadhaar Number"
                name="adhar_number"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Phone Number"
                name="phone_number"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="City"
                name="city"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="State"
                name="state"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Address"
                name="address"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Pincode"
                name="pincode"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 d-flex gap-2">
              <button
                type="button"
                onClick={handleLocation}
                className="btn btn-primary"
              >
                Use My Current Location
              </button>
            </div>

            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Latitude"
                name="latitude"
                value={formData.role_based_data.latitude || ""}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Longitude"
                name="longitude"
                value={formData.role_based_data.longitude || ""}
                onChange={handleChange}
                readOnly
              />
            </div>
          </>
        )}

        {formData.role === "Authority" && (
          <>
            <div className="mb-3">
              <label>Zone</label>
              <select
                className="form-select"
                name="zone"
                required
                onChange={handleChange}
              >
                <option value="">Select Zone</option>
                <option value="zone1">Zone 1</option>
                <option value="zone2">Zone 2</option>
                <option value="zone3">Zone 3</option>
                <option value="zone4">Zone 4</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Department</label>
              <select
                className="form-select"
                name="department"
                required
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Road">Road</option>
                <option value="Sanitation">Sanitation</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
