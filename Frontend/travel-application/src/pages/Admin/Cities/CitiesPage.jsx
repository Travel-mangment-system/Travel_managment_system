import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Bell,
  LayoutDashboard,
  Bus,
  Users,
  Settings,
  LogOut,
  Map,
  MapPin,
} from "lucide-react";

import "../BrowsePackagesPage.css"; // Reusing your main layout styles
import "./CitiesPage.css"; // We will create this below

export default function CitiesPage() {
  const navigate = useNavigate();

  // Layout State for Top Navbar
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    role: "",
    initials: "..",
  });

  // Cities State
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cityName: "",
    stateName: "",
  });

  const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/cities`;

  // 1. Fetch User Info & Verify Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userRole = decodedPayload.user_role || "USER";

      if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
        alert("Access Denied: You do not have administrator privileges.");
        navigate("/Admin-Dashboard");
        return;
      }

      const rawName = decodedPayload.sub || "Admin";
      const displayName = rawName.includes("@")
        ? rawName.split("@")[0]
        : rawName;
      const displayRole = userRole.replace("ROLE_", "");
      const formattedRole =
        displayRole.charAt(0).toUpperCase() +
        displayRole.slice(1).toLowerCase();
      const initials = displayName.substring(0, 2).toUpperCase();

      setUserInfo({
        name: displayName,
        role: formattedRole,
        initials: initials,
      });
    } catch (err) {
      console.error("Invalid token format:", err);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // 2. Fetch All Cities on Mount
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Handle Add City Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cityName.trim() || !formData.stateName.trim()) {
      toast.warning("City and State names are required.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      // POST request to your backend
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${formData.cityName} added successfully!`);
      setFormData({ cityName: "", stateName: "" }); // Clear form
      fetchCities(); // Refresh the table
    } catch (error) {
      console.error("Error creating city:", error);
      toast.error("Failed to add city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-packages-layout">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ===================== SIDEBAR ===================== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Bus className="brand-icon" size={32} />
          <span className="brand-text">TravelHub</span>
        </div>
        <div className="sidebar-title">Admin Panel</div>
        <nav className="sidebar-nav">
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Admin-Dashboard");
            }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-item">
            <Users size={20} /> Users
          </a>
          <a href="#" className="nav-item">
            <Bus size={20} /> Bus Providers
          </a>
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/manage-buses");
            }}
          >
            <Bus size={20} /> Manage Buses
          </a>
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/packages");
            }}
          >
            <Bus size={20} /> Packages
          </a>
          <a
            href="#"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/routes");
            }}
          >
            <Map size={20} /> Routes
          </a>

          {/* Active Cities Tab */}
          <a href="#" className="nav-item active">
            <MapPin size={20} /> Cities
          </a>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item">
            <Settings size={20} /> Settings
          </a>
          <button
            className="nav-item logout"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main-content">
        {/* TOP NAVBAR */}
        <header className="top-navbar">
          <div style={{ display: "flex", gap: "8px" }}>
            <div className="search-bar" style={{ visibility: "hidden" }}>
              <Search className="search-icon" size={20} />
              <input type="text" className="search-input" />
            </div>
          </div>
          <div className="top-actions">
            <button className="btn-icon">
              <Bell size={24} />
            </button>
            <div className="profile-section">
              <div className="avatar">{userInfo.initials}</div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#334155",
                  }}
                >
                  {userInfo.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {userInfo.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ACTUAL CITIES PAGE CONTENT */}
        <div
          className="page-container route-page-container"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <header className="route-header">
            <div>
              <h2>Manage Cities</h2>
              <p>Add and view service locations for travel routes.</p>
            </div>
          </header>

          <div className="route-content">
            {/* Left Column: Cities Table */}
            <div className="route-table-section">
              <div className="table-card">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>City ID</th>
                      <th>City Name</th>
                      <th>State Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-state">
                          No cities found. Add one to get started.
                        </td>
                      </tr>
                    ) : (
                      cities.map((city) => (
                        <tr key={city.id}>
                          <td className="fw-bold">CTY-{city.id}</td>
                          <td style={{ fontWeight: 500, color: "#0f172a" }}>
                            {city.cityName}
                          </td>
                          <td>{city.stateName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Add City Form */}
            <div className="route-form-section">
              <div className="form-card">
                <h3>Add New City</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>
                      City Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="cityName"
                      value={formData.cityName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Mumbai"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      State Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="stateName"
                      value={formData.stateName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Maharashtra"
                    />
                  </div>

                  <div className="form-actions" style={{ marginTop: "24px" }}>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() =>
                        setFormData({ cityName: "", stateName: "" })
                      }
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save City"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
