import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    
    navigate('/logout')
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Brand Logo */}
        <a className="navbar-brand" href="/manager/dashboard">
          <i className="bi bi-house-door-fill"></i> Manager Panel
        </a>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/manager/dashboard">
                <i className="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="/manager/manage-users">
                <i className="bi bi-people-fill"></i> Manage Users
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" href="/manager/profile">
                <i className="bi bi-person-circle"></i> Profile
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="/manager/settings">
                <i className="bi bi-gear-fill"></i> Settings
              </a>
            </li> */}
            <li className="nav-item">
              <button
                className="nav-link text-danger btn btn-link"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ManagerNavbar;
