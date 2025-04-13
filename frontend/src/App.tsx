import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/login";
import Register from "./components/Register";
import AuthorityDashboard from "./components/AuthorityDashboard";
import UserDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/protectedRoutes";
import NotFound from "./pages/NotFound";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/register" element={<CitizenRegister />} />

        {/* Protected Citizen Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
        path="/citizen/complaints/create"
        element={
          <ProtectedRoute allowedRole="Citizen">
            <CreateComplaint />
          </ProtectedRoute>
        }
      /> */}
      </Routes>
    </Router>
  );
}

export default App;
