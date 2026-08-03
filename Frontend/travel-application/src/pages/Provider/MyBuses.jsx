import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Bus,
  PlusSquare,
  Map,
  Route,
  ClipboardList,
  CircleDollarSign,
  Star,
  Settings,
  LogOut,
  Edit,
  Trash2,
} from "lucide-react";
import api from "../../services/api";
import "./Dashboard.css"; // Reusing the layout styles

const MyBuses = () => {
  const navigate = useNavigate();
  const providerName = localStorage.getItem("userName") || "Bus Provider";
  const userId = localStorage.getItem("userId");

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!userId) {
        console.error("🔴 MISSING ID: No 'userId' found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetching the list of buses using the bridge logic endpoint
        const response = await api.get(`/api/v1/providers/${userId}/buses`, {
          headers,
        });
        if (response.data) {
          // Safe array extraction ensuring response.data is treated as an array
          if (Array.isArray(response.data)) {
            setBuses(response.data);
          } else if (Array.isArray(response.data.buses)) {
            setBuses(response.data.buses);
          } else {
            setBuses([]);
          }
        }
      } catch (error) {
        console.error("🔴 API ERROR:", error);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [userId]);

  // DELETE LOGIC IMPLEMENTED HERE
  const handleDeleteBus = async (busId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this bus? All future bookings will be cancelled and refunded.",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await api.delete(`/api/v1/buses/${busId}`, { headers });

      alert(response.data || "Bus successfully deactivated.");

      // Instantly update the UI to show the bus as INACTIVE
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus.id === busId ? { ...bus, status: "INACTIVE" } : bus,
        ),
      );
    } catch (error) {
      console.error("🔴 API ERROR (Delete):", error);
      alert(
        error.response?.data?.message ||
          "Failed to deactivate the bus. Please try again.",
      );
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === "ACTIVE")
      return <span className="badge badge-success">Active</span>;
    if (s === "MAINTENANCE")
      return <span className="badge badge-warning">Maintenance</span>;
    if (s === "INACTIVE")
      return <span className="badge badge-danger">Inactive</span>;
    return <span className="badge badge-default">{status || "UNKNOWN"}</span>;
  };

  return (
    <div className="provider-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="provider-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-box">
            <Bus size={22} color="#FFFFFF" />
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
          <button className="nav-item active">
            <Bus size={20} /> My Buses
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/buses/add")}
          >
            <PlusSquare size={20} /> Add Bus
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/trips/schedule")}
          >
            <Map size={20} /> Trips
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/routes")}
          >
            <Route size={20} /> Routes
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

        <div
          className="dashboard-header-text"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 32px 0",
          }}
        >
          <div>
            <h1>My Buses 🚌</h1>
            <p>Manage your fleet, update details, or add new buses.</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/provider/buses/add")}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <PlusSquare size={18} /> Add New Bus
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner" style={{ padding: "32px" }}>
            Loading your fleet...
          </div>
        ) : (
          <div className="dashboard-body" style={{ padding: "32px" }}>
            <div className="departures-section">
              <div className="table-responsive">
                <table className="departures-table">
                  <thead>
                    <tr>
                      <th>Bus Name</th>
                      <th>Registration No.</th>
                      <th>Type</th>
                      <th>Total Seats</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(buses) && buses.length > 0 ? (
                      buses.map((bus) => (
                        <tr key={bus.id}>
                          <td>
                            <strong>{bus.busName}</strong>
                          </td>
                          <td>{bus.busNumber}</td>
                          <td>{bus.busType}</td>
                          <td>{bus.totalSeats}</td>
                          <td>{getStatusBadge(bus.status)}</td>
                          <td>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#4b5563",
                                }}
                                title="Edit Bus"
                              >
                                <Edit size={18} />
                              </button>

                              {/* ATTACHED DELETE LOGIC TO BUTTON */}
                              <button
                                onClick={() => handleDeleteBus(bus.id)}
                                disabled={
                                  bus.status?.toUpperCase() === "INACTIVE"
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor:
                                    bus.status?.toUpperCase() === "INACTIVE"
                                      ? "not-allowed"
                                      : "pointer",
                                  color:
                                    bus.status?.toUpperCase() === "INACTIVE"
                                      ? "#9ca3af"
                                      : "#ef4444",
                                }}
                                title={
                                  bus.status?.toUpperCase() === "INACTIVE"
                                    ? "Bus is already inactive"
                                    : "Deactivate Bus"
                                }
                              >
                                <Trash2 size={18} />
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
                            padding: "30px",
                            color: "#6b7280",
                          }}
                        >
                          No buses found in your fleet. Click "Add New Bus" to
                          get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBuses;
