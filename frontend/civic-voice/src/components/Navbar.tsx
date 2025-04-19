import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const role = localStorage.getItem("role"); // Get role

  return (
    <nav>
      <Link to="/">Home</Link>
      {role === "Citizen" && <Link to="/user-dashboard">User Dashboard</Link>}
      {role === "admin" && <Link to="/admin-dashboard">Admin Dashboard</Link>}
      {role === "Authority" && <Link to="/authority-dashboard">Authority Dashboard</Link>}
      <button onClick={() => localStorage.clear()}>Logout</button>
    </nav>
  );
};

export default Navbar;
