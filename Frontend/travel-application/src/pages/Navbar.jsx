import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  // 1. Make sure navigate is defined here
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm" style={{ position: 'relative', zIndex: 1050 }}>
      {/* ... (keep your existing logo and hamburger menu code here) ... */}
      
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav align-items-center gap-3">
          <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/packages">Packages</Link></li>

          {token ? (
            <>
              <li className="nav-item"><Link className="nav-link text-white" to="/my-bookings">My Bookings</Link></li>
              <li className="nav-item"><button className="btn btn-outline-light btn-sm px-3" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              {/* 2. THESE are the buttons you need to fix with onClick handlers */}
              <li className="nav-item">
                <button 
                  className="btn btn-primary btn-sm px-3 text-white" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm px-3" 
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;