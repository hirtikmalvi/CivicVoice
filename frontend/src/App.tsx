import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/login";
import Register from "./components/Register";
import AuthorityDashboard from "./components/AuthorityDashboard";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/protectedRoutes";
import NotFound from "./components/NotFound";
import CreateComplaint from "./components/CreateComplaint";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Citizen"]} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          {/* <Route path="/create-complaint" element = {<CreateComplaint />}/> */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["authority"]} />}>
          <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        </Route>

        {/* Catch-All for Unauthorized Access */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
