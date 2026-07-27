import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ zIndex: 1050 }}>
      <div className="logo" onClick={() => navigate("/")}>
        <i className="fa-solid fa-bus logo-icon"></i>
        <div className="logo-text">
          <h2>TravelHub</h2>
          <p>Journey Beyond Limits</p>
        </div>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/packages">Packages</Link></li>
        <li><Link to="/buses">Buses</Link></li>
        <li>Offers</li>
        <li>Routes</li>
        <li>About Us</li>
        <li>Contact Us</li>
      </ul>

      <div className="nav-right">
        <div className="nav-item">
          <i className="fa-solid fa-globe"></i> INR <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', marginLeft: '4px' }}></i>
        </div>
        <div className="nav-item support">
          <i className="fa-solid fa-headset"></i> 24/7 Support
        </div>

        {token ? (
          <>
            <button className="login-btn" onClick={() => navigate("/my-bookings")}>
              My Bookings
            </button>
            <button className="login-btn" onClick={handleLogout} style={{ background: "#dc3545", boxShadow: "0 4px 12px rgba(220, 53, 69, 0.25)" }}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            <i className="fa-regular fa-user"></i> Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


