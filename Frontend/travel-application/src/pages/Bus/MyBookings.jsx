import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Filter,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  CreditCard,
  Users,
} from "lucide-react";
import api from "../../services/api";
import "../Provider/Dashboard.css";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  
  // Checks "name" first, then "userName", defaults to "aditya"
  const userName = localStorage.getItem("name") || localStorage.getItem("userName") || "aditya";
  const userRole = localStorage.getItem("role") || "CUSTOMER";
  const userId = localStorage.getItem("userId") || 1;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real bookings from backend when component mounts
  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/v1/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map backend response data correctly matching your database entity properties
        const formattedBookings = (response.data || []).map((b) => {
          // Extract first booked seat details if available
          const firstSeat = b.bookedSeats?.[0] || {};
          const schedule = b.schedule || {};
          const route = schedule.route || {};
          const bus = schedule.bus || {};

          return {
            id: b.bookingId || b.id,
            pnrNumber: b.pnrNumber || b.bookingReference,
            status:
              b.bookingStatus === "CONFIRMED"
                ? "Upcoming"
                : b.bookingStatus === "PENDING"
                  ? "Upcoming"
                  : "Cancelled",
            rawStatus: b.bookingStatus,
            busName: bus.busName || schedule.busName || b.busName || "Express Bus",
            busNumber: bus.busNumber || schedule.busNumber || "MH-Schedule",
            busType: bus.busType || "AC Sleeper",
            seating: "2+1",
            source: firstSeat.boardingStop?.stopName || route.source || b.sourceCity || "Source",
            departureTime: schedule.departureDatetime
              ? new Date(schedule.departureDatetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            destination: firstSeat.dropOffStop?.stopName || route.destination || b.destinationCity || "Destination",
            arrivalTime: schedule.arrivalDatetime
              ? new Date(schedule.arrivalDatetime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            seats: b.bookedSeats
              ? b.bookedSeats
                  .map((s) => s.seat?.seatNumber || s.seatNumber)
                  .filter(Boolean)
                  .join(", ")
              : "N/A",
            amount: b.totalAmount || 0,
          };
        });

        setBookings(formattedBookings);
      } catch (err) {
        console.error("Failed to fetch user bookings:", err);
        setError("Failed to load your bookings from the database. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId]);

  // Handle Cancellation & Refund using the correctly mapped backend endpoint
  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? An 80% refund will be processed to your original payment method."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Call the exact endpoint mapped in BookingController.java
      await api.post(
        `/api/v1/bookings/${bookingId}/cancel`,
        {}, // Sending an empty body since the backend uses @PathVariable
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state locally to reflect cancellation instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: "Cancelled", rawStatus: "CANCELLED" }
            : b
        )
      );
      
      alert("Ticket cancelled successfully! 80% refund has been initiated to your account.");

    } catch (err) {
      console.error("Failed to cancel booking:", err);
      // Try to show the exact error message from the backend
      const errorMsg = err.response?.data || "Failed to process cancellation and refund. Please try again.";
      alert(typeof errorMsg === 'string' ? errorMsg : "Failed to cancel ticket.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "CU";
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return { bg: "#dcfce7", text: "#166534" };
      case "Completed":
        return { bg: "#f1f5f9", text: "#475569" };
      case "Cancelled":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === "All" || b.status === activeTab;
    const matchesSearch =
      b.pnrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.busName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const upcomingCount = bookings.filter((b) => b.status === "Upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;
  const totalSpent = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="provider-dashboard-layout" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100%" }}>
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
          <button className="nav-item" onClick={() => navigate("/buses")}>
            <Search size={20} /> Search Buses
          </button>
          <button className="nav-item active" onClick={() => navigate("/my-bookings")}>
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
          <button className="nav-item" onClick={() => navigate("/notifications")}>
            <Bell size={20} /> Notifications
          </button>
          <button className="nav-item" onClick={() => navigate("/profile")}>
            <User size={20} /> Profile Settings
          </button>
          <button className="nav-item" onClick={() => navigate("/settings")}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>
          <button
            className="nav-item logout-btn"
            style={{ display: "flex", alignItems: "center", height: "auto", padding: "12px 16px" }}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <LogOut size={24} style={{ color: "#ea580c", marginRight: "12px" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
              <span style={{ fontWeight: "600", fontSize: "14px", color: "#fff" }}>Logout</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Sign out from your account</span>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* TOPBAR */}
        <header className="page-topbar" style={{ height: "70px", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 32px", boxSizing: "border-box" }}>
          <div className="spacer"></div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="provider-profile" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <div className="avatar" style={{ width: "38px", height: "38px", backgroundColor: "#0f766e", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
                {getInitials(userName).substring(0, 1)}
              </div>
              <div className="profile-info" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                <strong style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                  {userName.toLowerCase()}
                </strong>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: "32px", width: "100%", boxSizing: "border-box", overflowY: "auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              My Bookings <Ticket size={24} color="#0f172a" />
            </h1>
            <p style={{ color: "#64748b", margin: 0 }}>View your upcoming, completed and cancelled bus bookings.</p>
          </div>

          {error && (
            <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Controls Row: Tabs & Search */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { name: "All Bookings", value: "All" },
                { name: "Upcoming", value: "Upcoming", count: upcomingCount },
                { name: "Completed", value: "Completed", count: completedCount },
                { name: "Cancelled", value: "Cancelled", count: cancelledCount },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: activeTab === tab.value ? "#f0fdfa" : "#fff",
                    border: activeTab === tab.value ? "1px solid #0f766e" : "1px solid #e2e8f0",
                    color: activeTab === tab.value ? "#0f766e" : "#475569",
                    fontWeight: activeTab === tab.value ? "600" : "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {tab.name}
                  {tab.count !== undefined && (
                    <span style={{ backgroundColor: activeTab === tab.value ? "#ccfbf1" : "#f1f5f9", padding: "2px 8px", borderRadius: "12px", fontSize: "11px" }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search by PNR or Bus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "10px 10px 10px 36px", border: "1px solid #e2e8f0", borderRadius: "8px", width: "260px", fontSize: "13px", outline: "none" }}
                />
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", color: "#475569", fontWeight: "500" }}>
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* MAIN GRID LAYOUT */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>
            {/* LEFT COLUMN: BOOKING LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#64748b" }}>
                  Loading your bookings from database...
                </div>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "24px",
                      display: "grid",
                      gridTemplateColumns: "1.5fr 2fr 1.2fr",
                      gap: "20px",
                      alignItems: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          backgroundColor: getStatusStyle(booking.status).bg,
                          color: getStatusStyle(booking.status).text,
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                          display: "inline-block",
                          marginBottom: "12px",
                        }}
                      >
                        {booking.status}
                      </span>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a" }}>{booking.busName}</h3>
                      <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b" }}>PNR: {booking.pnrNumber}</p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#64748b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <BusIcon size={14} /> {booking.busType}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Users size={14} /> {booking.seating}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "4px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0f766e" }}></div>
                        <div style={{ width: "2px", height: "40px", backgroundColor: "#e2e8f0", margin: "2px 0" }}></div>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "2px solid #0f766e", backgroundColor: "#fff" }}></div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: "16px" }}>
                          <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>{booking.source}</strong>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>{booking.departureTime}</span>
                        </div>
                        <div>
                          <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>{booking.destination}</strong>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>{booking.arrivalTime}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderLeft: "1px dashed #e2e8f0", paddingLeft: "20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                        <div>
                          <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Seats</span>
                          <strong style={{ fontSize: "12px", color: "#0f172a" }}>{booking.seats}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Amount</span>
                          <strong style={{ fontSize: "13px", color: "#0f172a" }}>₹{Number(booking.amount).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button
                          onClick={() => navigate(`/buses/${booking.id}/confirmation`)}
                          style={{ width: "100%", padding: "6px", backgroundColor: "#fff", border: "1px solid #0f766e", color: "#0f766e", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                        >
                          View Details
                        </button>
                        {booking.status === "Upcoming" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            style={{ width: "100%", padding: "6px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                          >
                            Cancel Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "60px", textAlign: "center", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Ticket size={40} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>No bookings found</h3>
                  <p style={{ color: "#64748b", margin: 0 }}>You haven't made any trips matching this filter yet.</p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SUMMARY CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#0f172a" }}>Booking Summary</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ backgroundColor: "#bbf7d0", padding: "8px", borderRadius: "50%" }}>
                        <Calendar size={18} color="#166534" />
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "12px", color: "#166534", fontWeight: "600" }}>Upcoming Trips</span>
                        <strong style={{ fontSize: "18px", color: "#14532d" }}>{upcomingCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ backgroundColor: "#bae6fd", padding: "8px", borderRadius: "50%" }}>
                        <CheckCircle2 size={18} color="#0369a1" />
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "12px", color: "#0369a1", fontWeight: "600" }}>Completed Trips</span>
                        <strong style={{ fontSize: "18px", color: "#0c4a6e" }}>{completedCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ backgroundColor: "#fecaca", padding: "8px", borderRadius: "50%" }}>
                        <XCircle size={18} color="#b91c1c" />
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "12px", color: "#b91c1c", fontWeight: "600" }}>Cancelled Trips</span>
                        <strong style={{ fontSize: "18px", color: "#7f1d1d" }}>{cancelledCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ backgroundColor: "#fde68a", padding: "8px", borderRadius: "50%" }}>
                        <CreditCard size={18} color="#b45309" />
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "12px", color: "#b45309", fontWeight: "600" }}>Total Spent</span>
                        <strong style={{ fontSize: "18px", color: "#78350f" }}>₹{totalSpent.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ backgroundColor: "#eff6ff", padding: "12px", borderRadius: "50%" }}>
                  <Headphones size={24} color="#2563eb" />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#0f172a" }}>Need help with your booking?</h4>
                  <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                    Our support team is here to assist you.
                  </p>
                  <button style={{ padding: "6px 16px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#0f172a", cursor: "pointer" }}>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBookings;