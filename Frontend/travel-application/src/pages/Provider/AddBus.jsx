import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import axios from "axios";
import "./AddBus.css";
import "./Dashboard.css";

// Create a custom axios instance that automatically attaches the JWT token
const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Helper function to decode the JWT token and extract the logged-in user's ID
const getUserIdFromToken = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

const AddBus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const providerName = localStorage.getItem("userName") || "Bus Provider";

  const [formData, setFormData] = useState({
    busNumber: "",
    busName: "",
    busType: "",
    totalSeats: "",
  });

  // State to hold the resolved Provider ID
  const [providerId, setProviderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Fetch Provider details using your exact GET /{id} endpoint
  useEffect(() => {
    const fetchProviderDetails = async () => {
      const userId = localStorage.getItem("userId") || getUserIdFromToken();

      if (!userId) {
        setMessage({
          text: "Could not find User ID. Please log in again.",
          type: "error",
        });
        return;
      }

      try {
        const response = await api.get(`/api/v1/providers/${userId}`);
        const providerData = response.data;

        if (providerData) {
          const realProviderId =
            providerData.id ||
            providerData.providerId ||
            providerData.busProviderId;

          if (realProviderId) {
            setProviderId(realProviderId);
          } else {
            setMessage({
              text: "Provider fetched, but ID is missing from JSON response! Please add 'id' to your backend DTO.",
              type: "error",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
        setMessage({
          text: "Failed to verify your provider account. Ensure your User ID matches a valid Provider ID.",
          type: "error",
        });
      }
    };

    fetchProviderDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!providerId) {
        throw new Error(
          "Provider ID is missing. Please wait for verification or log in again.",
        );
      }

      const payload = {
        busNumber: formData.busNumber,
        busName: formData.busName,
        busType: formData.busType,
        totalSeats: parseInt(formData.totalSeats, 10),
        providerId: parseInt(providerId, 10),
        routeId: null,
      };

      const response = await api.post("/api/v1/buses", payload);

      setMessage({
        text: `Success! Bus "${response.data.busName || formData.busName}" was added to your fleet.`,
        type: "success",
      });

      // Clear the form
      setFormData({
        busNumber: "",
        busName: "",
        busType: "",
        totalSeats: "",
      });
    } catch (error) {
      console.error("Error saving bus:", error);
      setMessage({
        text:
          error.message ||
          error.response?.data?.message ||
          "Failed to add bus. Please check backend connection.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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
          <button
            className="nav-item"
            onClick={() => navigate("/provider/buses")}
          >
            <Bus size={20} /> My Buses
          </button>
          <button className="nav-item active">
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
      <div className="dashboard-main-content">
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
          <div className="provider-profile">
            <div className="avatar">{providerName.charAt(0)}</div>
            <div className="profile-info">
              <strong>{providerName}</strong>
              <span>Provider</span>
            </div>
          </div>
        </header>

        <main className="dashboard-content" style={{ padding: "32px" }}>
          <div
            className="add-bus-container"
            style={{
              maxWidth: "100%",
              margin: 0,
              background: "transparent",
              boxShadow: "none",
              padding: 0,
            }}
          >
            <div
              className="page-header"
              style={{
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                Add New Bus 🚌
              </h2>
              <span style={{ color: "#666", fontSize: "14px" }}>
                Enter the physical details of the new vehicle. (Routes will be
                assigned later during scheduling).
              </span>
            </div>

            {message.text && (
              <div
                className={`alert-message ${message.type}`}
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

            <form
              onSubmit={handleSubmit}
              className="bus-form-card"
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="card-section-title"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "24px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "16px",
                }}
              >
                <span
                  className="icon-bus"
                  style={{
                    fontSize: "24px",
                    backgroundColor: "#e6f4f6",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  🚌
                </span>
                <div>
                  <h3
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#111",
                    }}
                  >
                    Vehicle Information
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                    Fill in the required details for your bus.
                  </p>
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
                      color: "#374151",
                    }}
                  >
                    Bus Number (License Plate) *
                  </label>
                  <input
                    type="text"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                    placeholder="e.g. MH12AB1234"
                    required
                    disabled={!providerId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
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
                      color: "#374151",
                    }}
                  >
                    Bus Name *
                  </label>
                  <input
                    type="text"
                    name="busName"
                    value={formData.busName}
                    onChange={handleChange}
                    placeholder="e.g. SRS Volvo Sleeper"
                    required
                    disabled={!providerId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
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
                      color: "#374151",
                    }}
                  >
                    Bus Type *
                  </label>
                  <select
                    name="busType"
                    value={formData.busType}
                    onChange={handleChange}
                    required
                    disabled={!providerId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="">Select bus type</option>
                    <option value="AC">AC</option>
                    <option value="NON_AC">Non-AC</option>
                    <option value="SLEEPER">Sleeper</option>
                    <option value="SEATER">Seater</option>
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
                      color: "#374151",
                    }}
                  >
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="Enter total number of seats"
                    min="1"
                    required
                    disabled={!providerId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div
                className="info-note-box"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "24px",
                }}
              >
                <span className="info-icon" style={{ fontSize: "16px" }}>
                  ℹ️
                </span>
                <div>
                  <strong
                    style={{
                      fontSize: "13px",
                      color: "#0369a1",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Next Steps
                  </strong>
                  <p style={{ margin: 0, fontSize: "13px", color: "#0369a1" }}>
                    Once this bus is saved to your fleet, you can go to the{" "}
                    <strong>Trips / Schedules</strong> tab to assign it to a
                    specific route, date, and time.
                  </p>
                </div>
              </div>

              <div
                className="form-actions"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "32px",
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "20px",
                }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  disabled={!providerId}
                  onClick={() =>
                    setFormData({
                      busNumber: "",
                      busName: "",
                      busType: "",
                      totalSeats: "",
                    })
                  }
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#fff",
                    color: "#374151",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={loading || !providerId}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? "Saving..." : "💾 Save Bus to Fleet"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddBus;
