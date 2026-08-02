import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Bus as BusIcon,
  Route as RouteIcon,
  Info,
  RotateCcw,
  Send,
  Eye,
  Edit,
  Trash2,
  Home,
  PlusSquare,
  Map,
  ClipboardList,
  CircleDollarSign,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import api from "../../services/api";
import "./ScheduleBus.css";
import "./Dashboard.css"; // Added to inherit exact sidebar & layout styles

const ScheduleBus = () => {
  const navigate = useNavigate();
  const providerName = localStorage.getItem("userName") || "SRS Travels";
  const userId = localStorage.getItem("userId");

  // Dropdown lists data
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form State (matching ScheduleRequest DTO)
  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    notes: "",
  });

  // Selected details for live preview summary card
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // 1. Fetch Buses, Routes, and Existing Schedules on Load
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch buses for this provider
        const busRes = await api.get(`/api/v1/providers/${userId}/buses`, {
          headers,
        });
        const busList = Array.isArray(busRes.data)
          ? busRes.data
          : busRes.data.buses || [];
        setBuses(busList);

        // Fetch all routes
        const routeRes = await api.get(`/routes`, { headers });
        setRoutes(Array.isArray(routeRes.data) ? routeRes.data : []);
      } catch (error) {
        console.error("Error fetching form dependencies:", error);
        setMessage({
          text: "Failed to load buses or routes configuration.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handle Input Changes & Update Live Summary Previews
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "busId") {
      const foundBus = buses.find(
        (b) => String(b.id || b.busId) === String(value),
      );
      setSelectedBus(foundBus || null);
    }

    if (name === "routeId") {
      const foundRoute = routes.find(
        (r) => String(r.id || r.routeId) === String(value),
      );
      setSelectedRoute(foundRoute || null);
    }
  };

  // Calculate Duration helper
  const calculateDuration = () => {
    if (
      !formData.departureDate ||
      !formData.departureTime ||
      !formData.arrivalDate ||
      !formData.arrivalTime
    ) {
      return "--";
    }
    const start = new Date(
      `${formData.departureDate}T${formData.departureTime}`,
    );
    const end = new Date(`${formData.arrivalDate}T${formData.arrivalTime}`);
    const diffMs = end - start;
    if (diffMs <= 0) return "Invalid time range";

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  // Format date preview string
  const formatDatePreview = (dateStr, timeStr) => {
    if (!dateStr) return "Not selected";
    const dateObj = new Date(dateStr);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return timeStr ? `${formattedDate}, ${timeStr}` : formattedDate;
  };

  // Submit Schedule Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        busId: parseInt(formData.busId, 10),
        routeId: parseInt(formData.routeId, 10),
        departureDatetime: `${formData.departureDate}T${formData.departureTime}:00`,
        arrivalDatetime: `${formData.arrivalDate}T${formData.arrivalTime}:00`,
      };

      const token = localStorage.getItem("token");
      await api.post("/api/v1/schedules", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ text: "Schedule successfully created!", type: "success" });

      // Reset form
      setFormData({
        busId: "",
        routeId: "",
        departureDate: "",
        departureTime: "",
        arrivalDate: "",
        arrivalTime: "",
        notes: "",
      });
      setSelectedBus(null);
      setSelectedRoute(null);
    } catch (error) {
      console.error("Error creating schedule:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to schedule bus. Check for overlapping timings.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="provider-dashboard-layout">
      {/* PERFECTLY ALIGNED SIDEBAR */}
      <aside className="provider-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-box">
            <BusIcon size={22} color="#FFFFFF" />
          </div>
          <div className="logo-text">
            <h2>TravelHub</h2>
            <p>Bus Provider Panel</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className="nav-item"
            onClick={() => navigate("/provider/dashboard")}
          >
            <Home size={20} /> Dashboard
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/buses")}
          >
            <BusIcon size={20} /> My Buses
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/buses/add")}
          >
            <PlusSquare size={20} /> Add Bus
          </button>
          <button className="nav-item active">
            <Map size={20} /> Trips
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/routes")}
          >
            <RouteIcon size={20} /> Routes
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/bookings")}
          >
            <ClipboardList size={20} /> Bookings
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/earnings")}
          >
            <CircleDollarSign size={20} /> Earnings
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/reviews")}
          >
            <Star size={20} /> Reviews
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/settings")}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        <button
          className="nav-item logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main-content">
        {/* TOPBAR MATCHING YOUR OTHER PAGES */}
        <header className="page-topbar">
          <div className="spacer"></div>
          <div className="provider-profile">
            <div className="avatar">{providerName.charAt(0)}</div>
            <div className="profile-info">
              <strong>{providerName}</strong>
              <span>Provider</span>
            </div>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <div
          style={{ padding: "32px", width: "100%", boxSizing: "border-box" }}
        >
          {/* PAGE HEADER */}
          <div className="page-header" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                Schedule Bus
              </h2>
              <span style={{ fontSize: "20px" }}>📅</span>
            </div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
              Trips <span style={{ margin: "0 6px" }}>›</span>{" "}
              <strong style={{ color: "#333" }}>Schedule Bus</strong>
            </div>
          </div>

          {/* BLUE INFO BANNER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "14px 18px",
              marginBottom: "24px",
            }}
          >
            <Info size={18} color="#0284c7" />
            <span style={{ fontSize: "13px", color: "#0369a1" }}>
              Schedule your bus for a specific route and date & time.
            </span>
          </div>

          {message.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
                backgroundColor:
                  message.type === "error" ? "#f8d7da" : "#d1e7dd",
                color: message.type === "error" ? "#842029" : "#0f5132",
              }}
            >
              {message.text}
            </div>
          )}

          {/* GRID LAYOUT: FORM & SUMMARY CARD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* LEFT: SCHEDULE FORM */}
            <form
              onSubmit={handleSubmit}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111",
                  margin: "0 0 4px 0",
                }}
              >
                Schedule Details
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                  margin: "0 0 24px 0",
                }}
              >
                Select bus, route and date & time for this schedule.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Select Bus */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Select Bus *
                  </label>
                  <select
                    name="busId"
                    value={formData.busId}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="">Select bus</option>
                    {buses.map((bus) => (
                      <option
                        key={bus.id || bus.busId}
                        value={bus.id || bus.busId}
                      >
                        {bus.busName} ({bus.busNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Route */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Select Route *
                  </label>
                  <select
                    name="routeId"
                    value={formData.routeId}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="">Select route</option>
                    {routes.map((route) => (
                      <option
                        key={route.id || route.routeId}
                        value={route.id || route.routeId}
                      >
                        {route.sourceCityName || route.startCity?.cityName} to{" "}
                        {route.destinationCityName || route.endCity?.cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROUTE STOPS TIMELINE PREVIEW */}
              {selectedRoute && (
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "14px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    color: "#475569",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      📍{" "}
                      <strong>
                        {selectedRoute.sourceCityName ||
                          selectedRoute.startCity?.cityName}
                      </strong>
                    </span>
                    <span style={{ color: "#94a3b8" }}>──────</span>
                    <span>
                      📍{" "}
                      <strong>
                        {selectedRoute.destinationCityName ||
                          selectedRoute.endCity?.cityName}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Departure Date & Time */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Departure Date & Time *
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px",
                      }}
                    />
                    <input
                      type="time"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      required
                      style={{
                        width: "110px",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                {/* Arrival Date & Time */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Arrival Date & Time *
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px",
                      }}
                    />
                    <input
                      type="time"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      required
                      style={{
                        width: "110px",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes for this trip..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                ></textarea>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      busId: "",
                      routeId: "",
                      departureDate: "",
                      departureTime: "",
                      arrivalDate: "",
                      arrivalTime: "",
                      notes: "",
                    })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#fff",
                    color: "#374151",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#f97316",
                    color: "#fff",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  <Send size={16} />{" "}
                  {submitting ? "Scheduling..." : "Schedule Bus"}
                </button>
              </div>
            </form>

            {/* RIGHT: SCHEDULE SUMMARY PREVIEW CARD */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "14px",
                  marginBottom: "16px",
                }}
              >
                <BusIcon size={20} color="#043b46" />
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111",
                    margin: 0,
                  }}
                >
                  Schedule Summary
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  fontSize: "13px",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Bus
                  </span>
                  <div style={{ fontWeight: "600", color: "#1f2937" }}>
                    {selectedBus
                      ? `${selectedBus.busName} (${selectedBus.busNumber})`
                      : "Not selected"}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Route
                  </span>
                  <div style={{ fontWeight: "600", color: "#1f2937" }}>
                    {selectedRoute
                      ? `${selectedRoute.sourceCityName || selectedRoute.startCity?.cityName} to ${selectedRoute.destinationCityName || selectedRoute.endCity?.cityName}`
                      : "Not selected"}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Departure
                  </span>
                  <div style={{ fontWeight: "600", color: "#1f2937" }}>
                    {formatDatePreview(
                      formData.departureDate,
                      formData.departureTime,
                    )}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Arrival
                  </span>
                  <div style={{ fontWeight: "600", color: "#1f2937" }}>
                    {formatDatePreview(
                      formData.arrivalDate,
                      formData.arrivalTime,
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: "12px",
                  }}
                >
                  <Clock size={16} color="#6b7280" />
                  <span style={{ color: "#6b7280" }}>Duration:</span>
                  <strong style={{ color: "#111" }}>
                    {calculateDuration()}
                  </strong>
                </div>

                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <span style={{ color: "#166534", fontWeight: "500" }}>
                    Total Distance
                  </span>
                  <strong style={{ color: "#166534" }}>
                    {selectedRoute?.distanceKm ||
                      selectedRoute?.distance ||
                      "150"}{" "}
                    km
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: UPCOMING SCHEDULES TABLE */}
          <div
            style={{
              marginTop: "32px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "24px",
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
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111",
                    margin: "0 0 4px 0",
                  }}
                >
                  Upcoming Schedules
                </h3>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  All your scheduled bus trips
                </p>
              </div>
              <button
                onClick={() => navigate("/provider/trips")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                View All Trips →
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      color: "#6b7280",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    <th style={{ padding: "12px" }}>Bus</th>
                    <th style={{ padding: "12px" }}>Route</th>
                    <th style={{ padding: "12px" }}>Departure</th>
                    <th style={{ padding: "12px" }}>Arrival</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules && schedules.length > 0 ? (
                    schedules.map((sch) => (
                      <tr
                        key={sch.scheduleId}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "14px 12px" }}>
                          <strong style={{ display: "block", color: "#111" }}>
                            {sch.busName}
                          </strong>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            {sch.busNumber}
                          </span>
                        </td>
                        <td style={{ padding: "14px 12px" }}>
                          <span style={{ display: "block", color: "#111" }}>
                            {sch.sourceCity} to {sch.destinationCity}
                          </span>
                        </td>
                        <td style={{ padding: "14px 12px", color: "#374151" }}>
                          {sch.departureDatetime}
                        </td>
                        <td style={{ padding: "14px 12px", color: "#374151" }}>
                          {sch.arrivalDatetime}
                        </td>
                        <td style={{ padding: "14px 12px" }}>
                          <span
                            style={{
                              backgroundColor: "#d1e7dd",
                              color: "#0f5132",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            Scheduled
                          </span>
                        </td>
                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              title="View Details"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#4b5563",
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              title="Edit Schedule"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#2563eb",
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              title="Cancel Schedule"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#ef4444",
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "24px",
                          color: "#6b7280",
                        }}
                      >
                        No active schedules created yet. Fill out the form above
                        to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleBus;
