import React, { useState, useEffect } from "react";
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
import "./Payment.css";
import "../Provider/Dashboard.css"; // Includes the shared customer layout styles

const Payment = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer info for Topbar
  const userName = localStorage.getItem("userName") || "Customer";

  const stateData = location.state || {};
  const [bookingResponse, setBookingResponse] = useState(
    stateData.bookingResponse || null,
  );
  const [totalPrice, setTotalPrice] = useState(stateData.totalPrice || 0);
  const { busDetails, boarding, dropping, selectedSeats } = stateData;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(!stateData.bookingResponse);
  const [error, setError] = useState("");

  // Fallback: If state was lost on refresh, fetch the latest booking from backend
  useEffect(() => {
    if (!bookingResponse) {
      const fetchLatestBooking = async () => {
        try {
          const token = localStorage.getItem("token");
          // Use your existing endpoint to find the latest booking or user bookings
          const userId = localStorage.getItem("userId") || 1;
          const response = await api.get(`/api/v1/bookings/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data.length > 0) {
            // Grab the most recent pending/latest booking
            const latest = response.data[response.data.length - 1];
            setBookingResponse(latest);
            setTotalPrice(latest.totalAmount);
          } else {
            setError(
              "No active booking reference found. Please restart your booking.",
            );
          }
        } catch (err) {
          console.error("Failed to fetch booking fallback:", err);
          setError("Could not retrieve booking details. Please start over.");
        } finally {
          setLoading(false);
        }
      };

      fetchLatestBooking();
    }
  }, [bookingResponse]);

  const handleConfirmPayment = async () => {
    if (!bookingResponse?.bookingId) {
      setError("No active booking found. Please restart your booking.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Call backend to update booking status from PENDING to CONFIRMED
      const response = await api.post(
        `/api/v1/bookings/${bookingResponse.bookingId}/confirm-payment?paymentMethod=${paymentMethod}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/buses/${busId}/confirmation`, {
        state: {
          confirmedBooking: response.data,
          busDetails,
          boarding,
          dropping,
        },
      });
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setError(
        err.response?.data?.message ||
          "Payment processing failed. Please try again.",
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
          {loading ? (
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "#6b7280",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              Loading payment details...
            </div>
          ) : !bookingResponse ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontSize: "20px", color: "#111" }}>
                No booking reference found.
              </h3>
              <p style={{ color: "#6b7280", margin: "10px 0 24px" }}>
                Your session may have expired or state was lost.
              </p>
              <button
                onClick={() => navigate("/buses")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ea580c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Back to Bus Search
              </button>
            </div>
          ) : (
            <div
              className="passenger-container"
              style={{ maxWidth: "100%", margin: 0 }}
            >
              {/* Progress Stepper */}
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
                <div className="step active completed">
                  <div className="step-circle">✓</div>
                  <span className="step-label">Passenger Details</span>
                </div>
                <div className="step active current">
                  <div className="step-circle">
                    <div className="inner-dot"></div>
                  </div>
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
                  Select Payment Method
                </h2>
                <p style={{ color: "#666", margin: 0 }}>
                  Complete your payment to confirm your booking (PNR:{" "}
                  <strong>
                    {bookingResponse.pnrNumber ||
                      bookingResponse.bookingReference}
                  </strong>
                  )
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
                {/* Left Side: Payment Options */}
                <div className="passenger-forms-column">
                  <div
                    className="passenger-card"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      padding: "24px",
                      borderRadius: "12px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 20px 0",
                        fontSize: "18px",
                        color: "#0f172a",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "16px",
                      }}
                    >
                      Choose Payment Option
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"].map(
                        (method) => (
                          <label
                            key={method}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              cursor: "pointer",
                              fontSize: "15px",
                              padding: "16px",
                              border:
                                paymentMethod === method
                                  ? "1px solid #ea580c"
                                  : "1px solid #e2e8f0",
                              borderRadius: "8px",
                              backgroundColor:
                                paymentMethod === method ? "#fff7ed" : "#fff",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={paymentMethod === method}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              style={{
                                accentColor: "#ea580c",
                                width: "18px",
                                height: "18px",
                              }}
                            />
                            <span
                              style={{
                                fontWeight:
                                  paymentMethod === method ? "600" : "500",
                                color: "#334155",
                              }}
                            >
                              {method.replace("_", " ")}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  <div
                    className="action-button-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "24px",
                    }}
                  >
                    <button
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
                      ← Back
                    </button>
                    <button
                      className="btn-continue"
                      onClick={handleConfirmPayment}
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
                      {loading ? "Processing Payment..." : `Pay ₹${totalPrice}`}
                    </button>
                  </div>
                </div>

                {/* Right Side: Summary */}
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
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "16px",
                      }}
                    >
                      Payment Summary
                    </h3>
                    <div className="fare-breakdown">
                      <div
                        className="fare-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                          fontSize: "14px",
                          color: "#475569",
                        }}
                      >
                        <span>Booking Reference</span>
                        <strong style={{ color: "#0f172a" }}>
                          {bookingResponse.pnrNumber ||
                            bookingResponse.bookingReference}
                        </strong>
                      </div>
                      <div
                        className="fare-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                          fontSize: "14px",
                          color: "#475569",
                        }}
                      >
                        <span>Total Seats</span>
                        <span style={{ fontWeight: "500", color: "#0f172a" }}>
                          {selectedSeats?.length ||
                            bookingResponse.bookedSeats?.length ||
                            1}{" "}
                          Seats
                        </span>
                      </div>
                      <div
                        className="fare-total-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "16px",
                          borderTop: "1px dashed #cbd5e1",
                          marginTop: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          Amount Payable
                        </span>
                        <span
                          className="total-amount-val"
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#ea580c",
                          }}
                        >
                          ₹{totalPrice || bookingResponse.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payment;
