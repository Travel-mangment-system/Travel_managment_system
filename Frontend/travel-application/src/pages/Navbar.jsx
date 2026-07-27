import React from 'react';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fa-solid fa-bus logo-icon"></i>
        <div className="logo-text">
          <h2>TravelHub</h2>
          <p>Journey Beyond Limits</p>
        </div>
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Buses</li>
        <li>Holiday Packages</li>
        <li>Offers</li>
        <li>Routes</li>
        <li>About Us</li>
        <li>Contact Us</li>
      </ul>

      <div className="nav-right">
        <div className="nav-item currency">
          <i className="fa-solid fa-globe"></i> INR <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
        </div>
        <div className="nav-item support">
          <i className="fa-solid fa-headset"></i>
          <span>24/7 Support</span>
        </div>
        <button className="login-btn">
          <i className="fa-regular fa-user"></i> Login / Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;