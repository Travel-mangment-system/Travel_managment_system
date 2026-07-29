import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Ticket,
  Wallet,
  Heart,
  Headphones,
  Bell,
  User,
  Settings,
  LogOut,
  Bus as BusIcon,
} from "lucide-react";
import BusCard from "../../components/ui/BusCard";
import { searchBuses } from "../../services/busService";
import "./BusSearch.css";
import "../Provider/Dashboard.css";

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Customer info for Topbar
  const userName = localStorage.getItem("userName") || "Customer";

  // Grab parameters dynamically from route state (passed from HomePage) or URL search params as fallback
  const searchState = location.state || {};
  const source = searchState.source || searchParams.get("source") || "Mumbai";
  const destination =
    searchState.destination || searchParams.get("destination") || "Pune";
  const date =
    searchState.journeyDate ||
    searchParams.get("date") ||
    new Date().toISOString().split("T")[0];

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real database records from backend when search parameters change
  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // Calls your backend service endpoint configured in auth/busService
        const response = await searchBuses(source, destination, date);
        // Handle response data correctly depending on whether it wraps inside .data or returns direct array
        const busList = response.data || response || [];
        setBuses(busList);
      } catch (error) {
        console.error("Failed to load buses from backend:", error);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination, date]);

  // Helper to generate initials dynamically for the avatar
  const getInitials = (name) => {
    if (!name) return "CU";
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="provider-dashboard-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        width: "100%",
      }}
    >
      {/* CUSTOMER SIDEBAR */}
      <aside className="provider-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-box" style={{ backgroundColor: "#ea580c" }}>
            <BusIcon size={22} color="#FFFFFF" />
          </div>
          <div className="logo-text">
            <h2>TravelHub</h2>
            <p style={{ opacity: 0.8 }}>Customer Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/home")}>
            <Home size={20} /> Dashboard
          </button>

          <button
            className="nav-item active"
            onClick={() => navigate("/buses")}
          >
            <Search size={20} /> Search Buses
          </button>

          <button className="nav-item" onClick={() => navigate("/my-bookings")}>
            <Ticket size={20} /> My Bookings
          </button>

          <button className="nav-item" onClick={() => navigate("/wallet")}>
            <Wallet size={20} /> My Wallet
          </button>

          <button className="nav-item" onClick={() => navigate("/favourites")}>
            <Heart size={20} /> Favourites
          </button>

          <button className="nav-item" onClick={() => navigate("/support")}>
            <Headphones size={20} /> Support
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={20} /> Notifications
          </button>

          <button className="nav-item" onClick={() => navigate("/profile")}>
            <User size={20} /> Profile Settings
          </button>

          <button className="nav-item" onClick={() => navigate("/settings")}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        {/* Logout Section */}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "10px",
          }}
        >
          <button
            className="nav-item logout-btn"
            style={{
              display: "flex",
              alignItems: "center",
              height: "auto",
              padding: "12px 16px",
            }}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LogOut
              size={24}
              style={{ color: "#ea580c", marginRight: "12px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: "1.2",
              }}
            >
              <span
                style={{ fontWeight: "600", fontSize: "14px", color: "#fff" }}
              >
                Logout
              </span>
              <span
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
              >
                Sign out from your account
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        className="dashboard-main-content"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* TOPBAR */}
        <header
          className="page-topbar"
          style={{
            height: "70px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 32px",
            boxSizing: "border-box",
          }}
        >
          <div className="spacer"></div>
          <div
            className="provider-profile"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              className="avatar"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#0f766e",
                color: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {getInitials(userName)}
            </div>
            <div className="profile-info">
              <strong
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333",
                  display: "block",
                }}
              >
                {userName}
              </strong>
              <span style={{ fontSize: "11px", color: "#777" }}>Customer</span>
            </div>
          </div>
        </header>

        {/* SEARCH UI CONTENT */}
        <div
          style={{
            padding: "32px",
            width: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <div
            className="bus-search-page"
            style={{
              padding: 0,
              margin: 0,
              minHeight: "auto",
              backgroundColor: "transparent",
            }}
          >
            <div
              className="bus-search-container"
              style={{ maxWidth: "100%", margin: 0 }}
            >
              <h1 className="page-title">Search Buses</h1>

              <div className="stepper-wrapper">
                <div className="stepper-line"></div>
                <div className="step active completed">
                  <div className="step-circle">✓</div>
                  <span className="step-label">Search</span>
                </div>
                <div className="step active current">
                  <div className="step-circle">
                    <div className="inner-dot"></div>
                  </div>
                  <span className="step-label">Select Bus</span>
                </div>
                <div className="step inactive">
                  <div className="step-circle"></div>
                  <span className="step-label">Seats</span>
                </div>
                <div className="step inactive">
                  <div className="step-circle"></div>
                  <span className="step-label">Passenger</span>
                </div>
                <div className="step inactive">
                  <div className="step-circle"></div>
                  <span className="step-label">Payment</span>
                </div>
                <div className="step inactive">
                  <div className="step-circle"></div>
                  <span className="step-label">Confirm</span>
                </div>
              </div>

              <div className="route-header">
                <div>
                  <h2 className="route-title">
                    {source} <span className="route-arrow">→</span>{" "}
                    {destination}
                  </h2>
                  <p className="route-date">{date}</p>
                </div>
                <button
                  onClick={() => navigate("/home")}
                  className="btn-change-search"
                >
                  Change Search
                </button>
              </div>

              <div className="bus-list">
                {loading ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Loading buses from database...
                  </div>
                ) : buses.length === 0 ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No buses found for this route on this date.
                  </div>
                ) : (
                  buses.map((bus) => (
                    <BusCard key={bus.scheduleId || bus.id} bus={bus} />
                  ))
                )}
              </div>

              <div className="list-footer">
                <p>
                  Showing {buses.length > 0 ? 1 : 0} to {buses.length} of{" "}
                  {buses.length} buses
                </p>
                <button className="btn-filter">
                  <span style={{ fontSize: "18px" }}>≡</span> Sort & Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusSearch;
