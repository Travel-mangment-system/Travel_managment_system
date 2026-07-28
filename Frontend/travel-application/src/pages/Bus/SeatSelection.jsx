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
import "./SeatSelection.css";
import "../Provider/Dashboard.css"; // Includes the shared customer layout styles

const SeatSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer info for Topbar
  const userName = localStorage.getItem("userName") || "Customer";

  const { boarding, dropping, calculatedFare, busDetails } =
    location.state || {};

  const scheduleId = busDetails?.scheduleId || busDetails?.id;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeats = async () => {
      if (!scheduleId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/api/v1/seats/bus/${busId}/schedule/${scheduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setSeats(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [busId, scheduleId]);

  const handleSeatClick = (seat) => {
    const isBooked = seat.booked || seat.isBooked || seat.status === "BOOKED";

    if (isBooked) return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
    } else {
      setSelectedSeats((prev) => [...prev, seat.id]);
    }
  };

  // --- UPDATED: CALLS BACKEND LOCK SEAT API TO GET A VALID UUID LOCK ID ---
  const handleContinue = async () => {
    setError("");
    setLocking(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId") || 2;

      const lockPayload = {
        userId: Number(userId),
        scheduleId: Number(scheduleId),
        seatIds: selectedSeats,
      };

      const lockResponse = await api.post(
        "/api/v1/bookings/lock-seat",
        lockPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const lockId = lockResponse.data.lockId || lockResponse.data;

      const selectedSeatObjects = seats.filter((seat) =>
        selectedSeats.includes(seat.id),
      );

      navigate(`/buses/${busId}/passenger-details`, {
        state: {
          boarding,
          dropping,
          selectedSeats: selectedSeatObjects,
          totalPrice: calculatedFare * selectedSeatObjects.length,
          busDetails,
          lockId, // <--- PASSES THE VALID LOCK ID TO PASSENGER DETAILS
        },
      });
    } catch (err) {
      console.error("Failed to lock seats:", err);
      setError(
        err.response?.data?.message ||
          "Failed to lock selected seats. Please try again.",
      );
    } finally {
      setLocking(false);
    }
  };

  // Helper to generate initials dynamically for the avatar
  const getInitials = (name) => {
    if (!name) return "CU";
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Create 2 + aisle + 2 layout dynamically
  const rows = [];

  for (let i = 0; i < seats.length; i += 4) {
    rows.push({
      left: seats.slice(i, i + 2),
      right: seats.slice(i + 2, i + 4),
    });
  }

  const getSeatClass = (seat) => {
    const booked = seat.booked || seat.isBooked || seat.status === "BOOKED";
    const selected = selectedSeats.includes(seat.id);

    if (booked) return "seat booked";
    if (selected) return "seat selected";
    return "seat available";
  };

  if (!busDetails) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
        }}
      >
        Please select a bus first.
      </div>
    );
  }

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

        {/* SEAT SELECTION UI CONTENT */}
        <div
          style={{
            padding: "32px",
            width: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
            paddingBottom: "100px",
          }}
        >
          <div
            className="seat-selection-page"
            style={{
              padding: 0,
              margin: 0,
              minHeight: "auto",
              backgroundColor: "transparent",
            }}
          >
            <div
              className="seat-selection-container"
              style={{ maxWidth: "100%", margin: 0 }}
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

              {/* Header */}
              <div className="page-header">
                <h2>Select Your Seats</h2>
                <p>Choose your preferred seats for the journey</p>
              </div>

              {error && (
                <div
                  className="error-banner"
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Bus Info */}
              <div className="bus-info-card">
                <div className="bus-identity">
                  <h3>{busDetails.busName || "Express Bus"}</h3>
                  <span className="bus-type">
                    {busDetails.busType || "AC Sleeper (2+1)"}
                  </span>
                </div>

                {/* Timing Row with Journey Line */}
                <div className="bus-timing-row">
                  <div className="time-block">
                    <h4>{busDetails.departureTime || "09:00 PM"}</h4>
                    <p>{boarding?.stopName || boarding?.name || "Source"}</p>
                  </div>

                  <div className="duration-line">
                    <div className="line"></div>
                    <span className="duration-text">Journey</span>
                    <div className="line"></div>
                  </div>

                  <div className="time-block text-right">
                    <h4>{busDetails.arrivalTime || "05:30 AM"}</h4>
                    <p>
                      {dropping?.stopName || dropping?.name || "Destination"}
                    </p>
                  </div>
                </div>

                {/* Bottom Summary Details Row */}
                <div className="stops-summary">
                  <div className="summary-point">
                    <span className="label">Boarding Point</span>
                    <span className="value">
                      {boarding?.stopName || boarding?.name || "Selected Stop"}
                    </span>
                  </div>

                  <div className="summary-point text-right">
                    <span className="label">Dropping Point</span>
                    <span className="value">
                      {dropping?.stopName || dropping?.name || "Selected Stop"}
                    </span>
                  </div>

                  <div className="summary-point text-right">
                    <span className="label">Segment Fare</span>
                    <span className="value fare-highlight">
                      ₹{calculatedFare}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="seat-legend">
                <div className="legend-item">
                  <span className="box available"></span>
                  Available
                </div>
                <div className="legend-item">
                  <span className="box selected"></span>
                  Selected
                </div>
                <div className="legend-item">
                  <span className="box booked"></span>
                  Booked
                </div>
              </div>

              {loading ? (
                <div
                  style={{
                    padding: "70px",
                    textAlign: "center",
                  }}
                >
                  Loading Seat Layout...
                </div>
              ) : (
                <div className="bus-layout-wrapper">
                  <div className="deck-title">Lower Deck</div>
                  <div className="bus-body">
                    <div className="driver-cabin">
                      <div className="steering-wheel">🛞</div>
                      Driver
                    </div>

                    <div className="seat-layout">
                      {rows.map((row, index) => (
                        <div className="seat-row" key={index}>
                          {/* Left Seats */}
                          <div className="seat-pair">
                            {row.left.map((seat) => (
                              <div
                                key={seat.id}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatClick(seat)}
                              >
                                {seat.seatNumber}
                              </div>
                            ))}
                          </div>

                          {/* Aisle */}
                          <div className="aisle"></div>

                          {/* Right Seats */}
                          <div className="seat-pair">
                            {row.right.map((seat) => (
                              <div
                                key={seat.id}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatClick(seat)}
                              >
                                {seat.seatNumber}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Fixed Full Width Alignment) */}
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
            zIndex: 10,
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
                Selected Seats
              </span>
              <strong style={{ fontSize: "18px", color: "#111" }}>
                {selectedSeats.length > 0 ? selectedSeats.length : "-"}
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
                Total Fare
              </span>
              <strong style={{ fontSize: "18px", color: "#111" }}>
                ₹
                {selectedSeats.length > 0
                  ? selectedSeats.length * calculatedFare
                  : "0"}
              </strong>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0 || locking}
            style={{
              backgroundColor:
                selectedSeats.length === 0 ? "#fdba74" : "#ea580c",
              color: "#fff",
              border: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {locking ? "Locking Seats..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
