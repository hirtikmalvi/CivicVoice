import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    console.log(formData)
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // Required for sending cookies
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      // Store role locally if needed
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role); // for ProtectedRoute

      navigate("/user-dashboard"); // redirect after login
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form className="w-50 mx-auto border p-4 rounded shadow" onSubmit={handleLogin}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
