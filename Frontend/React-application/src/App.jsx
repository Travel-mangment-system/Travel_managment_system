// import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import BusDetails from "./pages/BusDetails.jsx";
import BusBooking from "./pages/BusBooking"; // Ensure this matches your filename (.jsx or .js)
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx"; // Double check if your folder is named components or Components
import Register from "./pages/Register.jsx";
import Reviews from "./pages/Reviews.jsx";


/* 
  If this line throws an error saying "Module not found", 
  make sure App.css exists in this exact folder, or simply comment it out!
*/
import "./App.css";

// The testing menu component now handles its own visibility conditionally
function AppTestingMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 IF THE PATH IS NOT THE HOME PAGE, RETURN NOTHING (HIDE IT)
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div style={styles.testingBar}>
      <span style={styles.testingLabel}>App Testing Menu:</span>
      <button
        style={{ ...styles.testingBtn, ...styles.testingBtnActive }}
        onClick={() => navigate("/")}
      >
        Home / Search
      </button>
      <button
        style={styles.testingBtn} 
        onClick={() => navigate("/payment")}
      >
        Payment Page
      </button>
      <button
        style={styles.testingBtn} 
        onClick={() => navigate("/confirmation")}
      >
        Confirmation Page
      </button>
      <button
        style={styles.testingBtn} 
        onClick={() => navigate("/my-bookings")}
      >
        My Bookings Page
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        {/* This will now only render when you are on the home page view */}
        <AppTestingMenu />

        {/* --- Main Shared TravelEase Navbar --- */}
        <nav style={styles.navbar}>
          <Link to="/" style={styles.navLogo}>
            TravelEase
          </Link>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLinkBtnActive}>
              Home
            </Link>
            <Link to="/my-bookings" style={styles.navLinkBtnStyle}>
              My Bookings
            </Link>
            {/* <button
              style={styles.navLinkBtn}
              onClick={() => alert("Redirecting to Reviews...")}
            >
              Reviews
            </button> */}
            <Link to="/reviews" style={styles.navLinkBtnStyle}>
              Reviews
            </Link>
            <Link to="/login" style={styles.navLinkBtnStyle}>
              Login
            </Link>
            <Link to="/register" style={styles.navLinkBtnStyle}>
              Register
            </Link>
          </div>
        </nav>

        {/* --- Central Page Router --- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bus/:id" element={<BusDetails />} />
          <Route path="/booking" element={<BusBooking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </div>
    </Router>
  );
}

// Fixed syntax layout to prevent compiler compilation errors
const styles = {
  appContainer: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    margin: 0,
  },
  testingBar: {
    backgroundColor: "#111827",
    padding: "8px 24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #1f2937",
  },
  testingLabel: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "bold",
    marginRight: "8px",
  },
  testingBtn: {
    backgroundColor: "#374151",
    color: "#d1d5db",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
  },
  testingBtnActive: {
    backgroundColor: "#059669",
    color: "#ffffff",
    fontWeight: "bold",
  },
  navbar: {
    backgroundColor: "#1e2530",
    padding: "16px 64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLogo: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  navLinks: { 
    display: "flex", 
    gap: "12px", 
    alignItems: "center" 
  },
  navLinkBtn: {
    backgroundColor: "#2d3748",
    color: "#cbd5e1",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  navLinkBtnStyle: {
    backgroundColor: "#2d3748",
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    display: "inline-block",
  },
  navLinkBtnActive: {
    backgroundColor: "#0a7d71",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },
  registerBtn: {
    backgroundColor: "#ffffff",
    color: "#1e2530",
    border: "none",
    padding: "8px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
  },
};