import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/login";
import Register from "./components/Register";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import UserDashboard from "./pages/citizen/CitizenDashboard";
import ProtectedRoute from "./components/protectedRoutes";
import NotFound from "./pages/NotFound";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AuthorityLogin from "./pages/authority/AuthorityLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Complaint from "./pages/citizen/Complaint";
import AdminProfile from "./pages/admin/AdminProfile";
import { CitizenProfile } from "./pages/citizen/CitizenProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/register" element={<CitizenRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/authority/login" element={<AuthorityLogin />} />

        {/* Protected Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/complaint/:complaintId"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute>
              <CitizenProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authority/dashboard"
          element={
            <ProtectedRoute>
              <AuthorityDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
