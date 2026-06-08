import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import BusDetails from "./pages/BusDetails.jsx";
import BusBooking from "./pages/BusBooking";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Reviews from "./pages/Reviews.jsx";

import "./App.css";

// This component handles the conditional rendering of your main navbar
function MainNavbar() {
  const location = useLocation();

  // If the user is NOT on the home page, don't render the navbar at all
  if (location.pathname !== "/") {
    return null;
  }

  return (
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
  );
}

export default function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        {/* This navbar component will now automatically hide on other pages */}
        <MainNavbar />

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

const styles = {
  appContainer: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    margin: 0,
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
    alignItems: "center",
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
};
