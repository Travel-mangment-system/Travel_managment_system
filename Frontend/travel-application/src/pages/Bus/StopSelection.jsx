import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import api from "../../services/api";
import "../Provider/Dashboard.css";

const StopSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer info for Topbar
  const userName = localStorage.getItem("userName") || "Customer";

  // State from previous page (BusSearch)
  const busDetails = location.state?.busDetails || {};
  const baseFare = busDetails?.fare || 500;

  // Local State for Stops
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStops = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Mocking the data based on your screenshot
        setBoardingPoints([
          { id: 1, time: "17:55", name: "panvel" },
          { id: 2, time: "18:35", name: "khopoli" },
        ]);
        setDroppingPoints([
          { id: 3, time: "19:00", name: "Lonavala" },
          { id: 4, time: "19:20", name: "Hinjewadi" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [busId, busDetails]);

  const handleContinue = () => {
    navigate(`/buses/${busId}/seats`, {
      state: {
        busDetails,
        boarding: selectedBoarding,
        dropping: selectedDropping,
        calculatedFare: baseFare,
      },
    });
  };

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
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
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
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
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

        {/* STOP SELECTION UI CONTENT */}
        <div
          style={{
            padding: "32px",
            width: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
            paddingBottom: "120px",
          }}
        >
          {/* Booking Progress */}
          <div
            className="stepper-wrapper"
            style={{ margin: "0 auto 40px", maxWidth: "800px" }}
          >
            <div className="stepper-line"></div>
            <div className="step active completed">
              <div className="step-circle">✓</div>
              <span className="step-label">Search Buses</span>
            </div>
            <div className="step active current">
              <div className="step-circle">
                <div className="inner-dot"></div>
              </div>
              <span className="step-label">Select Seats</span>
            </div>
            <div className="step inactive">
              <div className="step-circle"></div>
              <span className="step-label">Passenger Details</span>
            </div>
            <div className="step inactive">
              <div className="step-circle"></div>
              <span className="step-label">Payment</span>
            </div>
            <div className="step inactive">
              <div className="step-circle"></div>
              <span className="step-label">Confirmation</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111",
                margin: 0,
              }}
            >
              Select Boarding & Dropping Point
            </h2>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
              Choose your boarding and dropping point to continue
            </p>
          </div>

          {/* Bus Info Header Card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", color: "#111" }}>
                {busDetails?.busName || "akka"}
              </h3>
              <span
                style={{
                  backgroundColor: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Bus No: {busDetails?.busNumber || "mh12df3592"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                  {busDetails?.departureTime || "17:41"}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: "14px",
                    textTransform: "lowercase",
                  }}
                >
                  {busDetails?.sourceCity || "mumbai"}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  margin: "0 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{ height: "1px", backgroundColor: "#d1d5db", flex: 1 }}
                ></div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    letterSpacing: "1px",
                  }}
                >
                  DIRECT
                </span>
                <div
                  style={{ height: "1px", backgroundColor: "#d1d5db", flex: 1 }}
                ></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                  {busDetails?.arrivalTime || "19:41"}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: "14px",
                    textTransform: "lowercase",
                  }}
                >
                  {busDetails?.destinationCity || "pune"}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              Loading stops...
            </div>
          ) : (
            <div style={{ display: "flex", gap: "24px" }}>
              {/* Boarding Points Column */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    fontSize: "16px",
                    color: "#111",
                  }}
                >
                  Boarding Point
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {boardingPoints.map((point) => (
                    <label
                      key={point.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        border:
                          selectedBoarding?.id === point.id
                            ? "1px solid #0f766e"
                            : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor:
                          selectedBoarding?.id === point.id
                            ? "#f0fdfa"
                            : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="boarding"
                        checked={selectedBoarding?.id === point.id}
                        onChange={() => setSelectedBoarding(point)}
                        style={{
                          marginRight: "16px",
                          accentColor: "#0f766e",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <span style={{ fontWeight: "600", width: "60px" }}>
                        {point.time}
                      </span>
                      <span
                        style={{
                          color: "#4b5563",
                          textTransform: "capitalize",
                        }}
                      >
                        {point.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dropping Points Column */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    fontSize: "16px",
                    color: "#111",
                  }}
                >
                  Dropping Point
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {droppingPoints.map((point) => (
                    <label
                      key={point.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        border:
                          selectedDropping?.id === point.id
                            ? "1px solid #0f766e"
                            : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor:
                          selectedDropping?.id === point.id
                            ? "#f0fdfa"
                            : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="dropping"
                        checked={selectedDropping?.id === point.id}
                        onChange={() => setSelectedDropping(point)}
                        style={{
                          marginRight: "16px",
                          accentColor: "#0f766e",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <span style={{ fontWeight: "600", width: "60px" }}>
                        {point.time}
                      </span>
                      <span
                        style={{
                          color: "#4b5563",
                          textTransform: "capitalize",
                        }}
                      >
                        {point.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTop: "1px solid #e5e7eb",
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", gap: "40px" }}>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Selected Route
              </span>
              <strong
                style={{
                  fontSize: "14px",
                  color: "#111",
                  textTransform: "lowercase",
                }}
              >
                {busDetails?.sourceCity || "mumbai"} →{" "}
                {busDetails?.destinationCity || "pune"}
              </strong>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Boarding
              </span>
              <strong
                style={{
                  fontSize: "14px",
                  color: "#111",
                  textTransform: "capitalize",
                }}
              >
                {selectedBoarding
                  ? `${selectedBoarding.name} (${selectedBoarding.time})`
                  : "-"}
              </strong>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Dropping
              </span>
              <strong
                style={{
                  fontSize: "14px",
                  color: "#111",
                  textTransform: "capitalize",
                }}
              >
                {selectedDropping
                  ? `${selectedDropping.name} (${selectedDropping.time})`
                  : "-"}
              </strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ textAlign: "right" }}>
              <span
                style={{ display: "block", fontSize: "11px", color: "#6b7280" }}
              >
                Base Fare
              </span>
              <strong
                style={{
                  fontSize: "20px",
                  color: "#111",
                  display: "block",
                  lineHeight: "1.2",
                }}
              >
                ₹{baseFare}
              </strong>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                Per Person
              </span>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedBoarding || !selectedDropping}
              style={{
                backgroundColor:
                  !selectedBoarding || !selectedDropping
                    ? "#fdba74"
                    : "#ea580c",
                color: "#fff",
                border: "none",
                padding: "14px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "15px",
                cursor:
                  !selectedBoarding || !selectedDropping
                    ? "not-allowed"
                    : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              Continue to Seat Selection
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StopSelection;
