import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => (location.pathname.includes(path) ? "active" : "");

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
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </Link>
        <Link to="/users" className={`nav-item ${isActive("/users")}`}>
          <span className="nav-icon">👥</span>
          Users
        </Link>

        {/* Packages Menu (Expanded as shown in image) */}
        <div className="nav-group">
          <div className="nav-item">
            <span className="nav-icon">📦</span>
            Packages
            <span className="chevron">▼</span>
          </div>
          <div className="nav-sub-menu">
            <Link to="/packages/all" className="sub-item">
              All Packages
            </Link>
            <Link to="/packages/add" className="sub-item">
              Add Package
            </Link>
          </div>
        </div>

        <Link to="/buses" className={`nav-item ${isActive("/buses")}`}>
          <span className="nav-icon">🚍</span>
          Buses
        </Link>
        <Link to="/bookings" className={`nav-item ${isActive("/bookings")}`}>
          <span className="nav-icon">📅</span>
          Bookings
        </Link>
        <Link to="/enquiries" className={`nav-item ${isActive("/enquiries")}`}>
          <span className="nav-icon">❓</span>
          Enquiries
        </Link>
        <Link to="/payments" className={`nav-item ${isActive("/payments")}`}>
          <span className="nav-icon">💳</span>
          Payments
        </Link>
        <Link to="/reports" className={`nav-item ${isActive("/reports")}`}>
          <span className="nav-icon">📊</span>
          Reports
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
        <button className="btn-logout">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
