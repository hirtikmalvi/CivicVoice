import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const AuthorityNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // document.cookie = 'token=; Max-Age=0; path=/';
    localStorage.removeItem("token");
    navigate("/authority/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1a1f36' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/authority/dashboard">
            CivicVoice - Authority
          </Link>

          <button
            className="navbar-toggler navbar-dark"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#authorityNavbarNav"
            aria-controls="authorityNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="authorityNavbarNav">
            <ul className="navbar-nav ms-auto gap-2">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/authority/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/authority/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Render nested routes */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default AuthorityNavbar;
