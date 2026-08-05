import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to check if a link is active
  const isActive = (path) => (location.pathname.includes(path) ? "active" : "");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">🚌</div>
          <div className="logo-text">
            <h2>TravelHub</h2>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/Admin-Dashboard"
          className={`nav-item ${location.pathname === "/Admin-Dashboard" ? "active" : ""}`}
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </Link>
        
        <Link to="/users" className={`nav-item ${isActive("/users")}`}>
          <span className="nav-icon">👥</span>
          Users
        </Link>

        <Link to="/buses" className={`nav-item ${isActive("/buses")}`}>
          <span className="nav-icon">🚍</span>
          Bus Providers
        </Link>

        <Link to="/manage-buses" className={`nav-item ${isActive("/manage-buses")}`}>
          <span className="nav-icon">🚌</span>
          Manage Buses
        </Link>

        {/* Packages Menu */}
        <div className="nav-group">
          <div className="nav-item">
            <span className="nav-icon">📦</span>
            Packages
            <span className="chevron">▼</span>
          </div>
          <div className="nav-sub-menu">
            <Link to="/packages" className="sub-item">
              All Packages
            </Link>
          </div>
        </div>

        {/* PERMANENT ROUTES LINK IN SIDEBAR */}
        <Link to="/admin/routes" className={`nav-item ${isActive("/admin/routes")}`}>
          <span className="nav-icon">🗺️</span>
          Routes
        </Link>

        {/* 👇 ADDED CITIES LINK HERE 👇 */}
        <Link to="/admin/cities" className={`nav-item ${isActive("/admin/cities")}`}>
          <span className="nav-icon">📍</span>
          Cities
        </Link>

        <Link to="/settings" className={`nav-item ${isActive("/settings")}`}>
          <span className="nav-icon">⚙️</span>
          Settings
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="help-box">
          <h4>Need Help?</h4>
          <p>We are here to help you.</p>
          <button className="btn-support">🎧 Contact Support</button>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;