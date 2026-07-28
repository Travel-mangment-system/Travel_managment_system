import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import "./PassengerDetails.css";
import "../Provider/Dashboard.css"; // Includes the shared customer layout styles

const PassengerDetails = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer info for Topbar
  const userName = localStorage.getItem("userName") || "Customer";

  // Retrieve state passed from SeatSelection (including lockId)
  const { boarding, dropping, selectedSeats, totalPrice, busDetails, lockId } =
    location.state || {};

  // Initialize passenger forms dynamically based on selected seats count
  const [passengers, setPassengers] = useState(
    selectedSeats
      ? selectedSeats.map((seat) => ({
          seatId: seat.id,
          seatNumber: seat.seatNumber || seat.number,
          fullName: "",
          age: "",
          gender: "Male",
          email: "",
          mobileNumber: "",
          idProofType: "Voter ID",
          idProofNumber: "",
        }))
      : [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    for (let i = 0; i < passengers.length; i++) {
      if (
        !passengers[i].fullName ||
        !passengers[i].age ||
        !passengers[i].gender
      ) {
        setError(`Please fill out all required fields for Passenger ${i + 1}`);
        return;
      }
    }

    if (!lockId) {
      setError(
        "Seat lock reference is missing or expired. Please re-select your seats.",
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId") || 2;
      console.log("Token being sent:", token);

      // Construct payload matching your backend BookingRequestDto structure
      const bookingPayload = {
        userId: Number(userId),
        lockId: lockId, // Uses the real UUID lock ID passed from SeatSelection
        paymentMethod: "ONLINE",
        boardingStopId: boarding?.id || boarding?.stopId,
        dropOffStopId: dropping?.id || dropping?.stopId,
        passengers: passengers.map((p) => ({
          seatId: p.seatId,
          fullName: p.fullName,
          age: Number(p.age),
          gender: p.gender,
        })),
      };

      // --- SENDS POST REQUEST TO STORE BOOKING AS PENDING IN DB ---
      const response = await api.post("/api/v1/bookings", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookingResponse = response.data; // Contains bookingId, pnrNumber, totalAmount, etc.

      // Navigate to payment page with the newly created booking response data
      navigate(`/buses/${busId}/payment`, {
        state: {
          bookingResponse,
          totalPrice,
          busDetails,
          boarding,
          dropping,
          selectedSeats,
        },
      });
    } catch (err) {
      console.error("Failed to create pending booking in database:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process booking. Please check inputs and try again.",
      );
    } finally {
      setLoading(false);
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

  if (!busDetails || !selectedSeats || selectedSeats.length === 0) {
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
        <div
          style={{
            margin: "auto",
            padding: "60px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#111", marginBottom: "16px" }}>
            No seats selected.
          </h3>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 24px",
              backgroundColor: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← Back to Seats
          </button>
        </div>
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

        {/* PAGE CONTENT */}
        <div
          style={{
            padding: "32px",
            width: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <div
            className="passenger-details-page"
            style={{
              padding: 0,
              margin: 0,
              minHeight: "auto",
              backgroundColor: "transparent",
            }}
          >
            <div
              className="passenger-container"
              style={{ maxWidth: "100%", margin: 0 }}
            >
              {/* Progress Stepper (Updated to match consistent UI) */}
              <div
                className="stepper-wrapper"
                style={{ margin: "0 auto 40px", maxWidth: "800px" }}
              >
                <div className="stepper-line"></div>
                <div className="step active completed">
                  <div className="step-circle">✓</div>
                  <span className="step-label">Search Buses</span>
                </div>
                <div className="step active completed">
                  <div className="step-circle">✓</div>
                  <span className="step-label">Select Seats</span>
                </div>
                <div className="step active current">
                  <div className="step-circle">
                    <div className="inner-dot"></div>
                  </div>
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

              {/* Page Header */}
              <div className="page-header" style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#111",
                    margin: "0 0 8px 0",
                  }}
                >
                  Add Passenger Details
                </h2>
                <p style={{ color: "#666", margin: 0 }}>
                  Enter details for all passengers. All names must match
                  government ID proof.
                </p>
              </div>

              {error && (
                <div
                  className="error-banner"
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                className="booking-layout-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "24px",
                  alignItems: "start",
                }}
              >
                {/* Left Column: Passenger Forms */}
                <form
                  onSubmit={handleSubmit}
                  className="passenger-forms-column"
                >
                  <div
                    className="section-title-bar"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f8fafc",
                      padding: "16px",
                      borderRadius: "8px 8px 0 0",
                      border: "1px solid #e2e8f0",
                      borderBottom: "none",
                    }}
                  >
                    <h3
                      style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}
                    >
                      Passenger Information
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      Total Passengers: {passengers.length}
                    </span>
                  </div>

                  {passengers.map((p, index) => (
                    <div
                      key={p.seatId}
                      className="passenger-card"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        padding: "24px",
                        marginBottom: "16px",
                        borderRadius: index === 0 ? "0 0 8px 8px" : "8px",
                      }}
                    >
                      <div
                        className="passenger-card-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                          paddingBottom: "16px",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <span
                          className="passenger-heading"
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          Passenger {index + 1}{" "}
                          <small
                            style={{
                              color: "#64748b",
                              fontWeight: "400",
                              marginLeft: "8px",
                            }}
                          >
                            (Seat: {p.seatNumber})
                          </small>
                        </span>

                        <div
                          className="gender-selector"
                          style={{ display: "flex", gap: "16px" }}
                        >
                          {["Male", "Female", "Other"].map((g) => (
                            <label
                              key={g}
                              className="radio-label"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#334155",
                              }}
                            >
                              <input
                                type="radio"
                                name={`gender-${index}`}
                                checked={p.gender === g}
                                onChange={() =>
                                  handleInputChange(index, "gender", g)
                                }
                                style={{ accentColor: "#ea580c" }}
                              />
                              {g}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div
                        className="form-grid"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "20px",
                        }}
                      >
                        <div
                          className="form-group full-width"
                          style={{
                            gridColumn: "span 2",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            Full Name*
                          </label>
                          <input
                            type="text"
                            placeholder="Enter full name"
                            value={p.fullName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "fullName",
                                e.target.value,
                              )
                            }
                            required
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                            }}
                          />
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            Age*
                          </label>
                          <input
                            type="number"
                            placeholder="Enter age"
                            value={p.age}
                            onChange={(e) =>
                              handleInputChange(index, "age", e.target.value)
                            }
                            required
                            min="1"
                            max="120"
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                            }}
                          />
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            Nationality*
                          </label>
                          <select
                            value={p.nationality || "Indian"}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "nationality",
                                e.target.value,
                              )
                            }
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <option value="Indian">Indian</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            Email ID
                          </label>
                          <input
                            type="email"
                            placeholder="Enter email (optional)"
                            value={p.email}
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                            }}
                          />
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            Mobile Number*
                          </label>
                          <div
                            className="mobile-input-wrapper"
                            style={{ display: "flex" }}
                          >
                            <select
                              className="country-code"
                              style={{
                                padding: "10px",
                                border: "1px solid #cbd5e1",
                                borderRight: "none",
                                borderRadius: "6px 0 0 6px",
                                backgroundColor: "#f8fafc",
                                color: "#475569",
                                width: "70px",
                              }}
                            >
                              <option>+91</option>
                            </select>
                            <input
                              type="tel"
                              placeholder="Enter mobile number"
                              value={p.mobileNumber}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "mobileNumber",
                                  e.target.value,
                                )
                              }
                              style={{
                                flex: 1,
                                padding: "10px 14px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "0 6px 6px 0",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            ID Proof Type*
                          </label>
                          <select
                            value={p.idProofType}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "idProofType",
                                e.target.value,
                              )
                            }
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <option value="Voter ID">Voter ID</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Driving License">
                              Driving License
                            </option>
                          </select>
                        </div>

                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            ID Proof Number*
                          </label>
                          <input
                            type="text"
                            placeholder="Enter ID number"
                            value={p.idProofNumber}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "idProofNumber",
                                e.target.value,
                              )
                            }
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div
                    className="action-button-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "24px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-back"
                      onClick={() => navigate(-1)}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#fff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        color: "#475569",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      ← Back to Seats
                    </button>
                    <button
                      type="submit"
                      className="btn-continue"
                      disabled={loading}
                      style={{
                        padding: "12px 32px",
                        backgroundColor: "#ea580c",
                        border: "none",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Saving Booking..." : "Continue to Payment →"}
                    </button>
                  </div>
                </form>

                {/* Right Column: Trip Summary Card */}
                <div className="trip-summary-column">
                  <div
                    className="summary-card"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      padding: "24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 20px 0",
                        fontSize: "18px",
                        color: "#0f172a",
                      }}
                    >
                      Trip Summary
                    </h3>

                    <div
                      className="summary-bus-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          color: "#1e293b",
                        }}
                      >
                        {busDetails.busName || "Express Bus"}
                      </h4>
                      <span
                        className="bus-type-badge"
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {busDetails.busType || "AC Sleeper (2+1)"}
                      </span>
                    </div>

                    <div
                      className="summary-timing-block"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <strong
                          style={{
                            fontSize: "18px",
                            color: "#0f172a",
                            display: "block",
                          }}
                        >
                          {busDetails.departureTime || "09:00 PM"}
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "13px",
                            color: "#64748b",
                            textTransform: "capitalize",
                          }}
                        >
                          {boarding?.stopName || boarding?.name}
                        </p>
                      </div>
                      <div
                        className="summary-divider-line"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: "#cbd5e1",
                          margin: "0 16px",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          →
                        </span>
                      </div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <strong
                          style={{
                            fontSize: "18px",
                            color: "#0f172a",
                            display: "block",
                          }}
                        >
                          {busDetails.arrivalTime || "05:30 AM"}
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "13px",
                            color: "#64748b",
                            textTransform: "capitalize",
                          }}
                        >
                          {dropping?.stopName || dropping?.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className="summary-section-divider"
                      style={{
                        height: "1px",
                        backgroundColor: "#f1f5f9",
                        margin: "24px 0",
                      }}
                    ></div>

                    <div
                      className="selected-seats-info"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Selected Seats
                        </span>
                        <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                          {selectedSeats
                            .map((s) => s.seatNumber || s.number)
                            .join(", ")}
                        </strong>
                      </div>
                      <span
                        className="seat-count-badge"
                        style={{
                          backgroundColor: "#fff7ed",
                          color: "#ea580c",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: "1px solid #fed7aa",
                        }}
                      >
                        {selectedSeats.length} Seats
                      </span>
                    </div>

                    <div
                      className="summary-section-divider"
                      style={{
                        height: "1px",
                        backgroundColor: "#f1f5f9",
                        margin: "24px 0",
                      }}
                    ></div>

                    <div className="fare-breakdown">
                      <h4
                        style={{
                          margin: "0 0 16px 0",
                          fontSize: "14px",
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Fare Details
                      </h4>
                      <div
                        className="fare-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          fontSize: "14px",
                          color: "#334155",
                        }}
                      >
                        <span>Base Fare ({selectedSeats.length} Seats)</span>
                        <span>₹{totalPrice}</span>
                      </div>
                      <div
                        className="fare-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                          fontSize: "14px",
                          color: "#334155",
                        }}
                      >
                        <span>Boarding / Dropping Charges</span>
                        <span>₹0.00</span>
                      </div>
                      <div
                        className="fare-total-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "16px",
                          borderTop: "1px dashed #cbd5e1",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          Total Amount
                        </span>
                        <span
                          className="total-amount-val"
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#ea580c",
                          }}
                        >
                          ₹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerDetails;
