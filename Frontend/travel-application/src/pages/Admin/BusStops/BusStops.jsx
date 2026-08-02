import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Search, Bell, LayoutDashboard, Bus, Users, Settings, LogOut, Map, MapPin 
} from "lucide-react";

import "../BrowsePackagesPage.css"; 
import "./BusStops.css";

export default function BusStops() {
  const navigate = useNavigate();
  
  // Layout State
  const [userInfo, setUserInfo] = useState({ name: "Loading...", role: "", initials: ".." });

  // Data States
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State for New Stop
  const [formData, setFormData] = useState({
    stopName: "",
    stopOrder: "",
    arrivalTime: "",
    departureTime: "",
  });

  const ROUTES_API_URL = "http://localhost:8080/routes";
  const STOPS_API_URL = "http://localhost:8080/api/v1/bus-stops";

  // 1. Fetch User Info for Header & Token Validation
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userRole = decodedPayload.user_role || "USER";
      const rawName = decodedPayload.sub || "User";
      const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
      const displayRole = userRole.replace("ROLE_", "");
      const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1).toLowerCase();
      const initials = displayName.substring(0, 2).toUpperCase();
      
      setUserInfo({ name: displayName, role: formattedRole, initials: initials });
    } catch (err) {
      console.error("Invalid token format:", err);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // 2. Fetch Routes on Mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  // 3. Fetch Stops whenever Selected Route Changes
  useEffect(() => {
    if (selectedRouteId) {
      fetchStopsForRoute(selectedRouteId);
    } else {
      setStops([]);
    }
  }, [selectedRouteId]);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(ROUTES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load routes.");
    }
  };

  const fetchStopsForRoute = async (routeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${STOPS_API_URL}/route/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStops(response.data);
    } catch (error) {
      console.error("Error fetching stops:", error);
      toast.error("Failed to load stops for this route.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRouteId) {
      toast.warning("Please select a route first.");
      return;
    }

    setLoading(true);
    const payload = {
      routeId: Number(selectedRouteId),
      stopName: formData.stopName,
      stopOrder: Number(formData.stopOrder),
      arrivalTime: formData.arrivalTime,
      departureTime: formData.departureTime,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(STOPS_API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bus stop added successfully!");
      setFormData({ stopName: "", stopOrder: "", arrivalTime: "", departureTime: "" });
      fetchStopsForRoute(selectedRouteId); 
    } catch (error) {
      console.error("Error creating bus stop:", error);
      toast.error("Failed to create bus stop.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stopId) => {
    if (!stopId) {
      toast.error("Invalid stop ID.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this bus stop?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${STOPS_API_URL}/${stopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bus stop deleted successfully!");
      fetchStopsForRoute(selectedRouteId);
    } catch (error) {
      console.error("Error deleting bus stop:", error);
      toast.error("Failed to delete bus stop.");
    }
  };

  return (
    <div className="manage-packages-layout">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Bus className="brand-icon" size={32} />
          <span className="brand-text">TravelHub</span>
        </div>
        <div className="sidebar-title">Admin Panel</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/Admin-Dashboard"); }}><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/users"); }}><Users size={20} /> Users</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/buses"); }}><Bus size={20} /> Bus Providers</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/manage-buses"); }}><Bus size={20} /> Manage Buses</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/packages"); }}><Bus size={20} /> Packages</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/routes"); }}><Map size={20} /> Routes</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/cities"); }}><MapPin size={20} /> Cities</a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate("/admin/stops"); }}><MapPin size={20} /> Bus Stops</a>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
          <button className="nav-item logout" onClick={handleLogout} style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-navbar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="search-bar" style={{ visibility: 'hidden' }}>
              <Search className="search-icon" size={20} />
              <input type="text" className="search-input" />
            </div>
          </div>
          <div className="top-actions">
            <button className="btn-icon"><Bell size={24} /></button>
            <div className="profile-section">
              <div className="avatar">{userInfo.initials}</div>
              <div>
                <div style={{fontWeight: 600, fontSize: '0.875rem', color: '#334155'}}>{userInfo.name}</div>
                <div style={{fontSize: '0.75rem', color: '#64748b'}}>{userInfo.role}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-container bus-stops-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Bus Stops</h1>
              <p className="page-subtitle">Select a route to view and add intermediate stops.</p>
            </div>
          </div>

          {/* ROUTE SELECTOR BAR */}
          <div className="route-selector-card">
            <label>Select Target Route:</label>
            <select 
              value={selectedRouteId} 
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              <option value="">-- Choose a Route --</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  RTE{route.id}: {route.sourceCityName} ➔ {route.destinationCityName}
                </option>
              ))}
            </select>
          </div>

          {selectedRouteId && (
            <div className="stops-grid-layout">
              {/* Left: Stops Table */}
              <div className="stops-card">
                <div className="stops-card-header">Stops for Selected Route</div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Stop Name</th>
                        <th>Arrival</th>
                        <th>Departure</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stops.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">No stops added for this route yet.</td>
                        </tr>
                      ) : (
                        stops.map((stop) => (
                          <tr key={stop.id || stop.stopOrder}>
                            <td>#{stop.stopOrder}</td>
                            <td style={{ fontWeight: 600, color: '#334155' }}>{stop.stopName}</td>
                            <td>{stop.arrivalTime || "N/A"}</td>
                            <td>{stop.departureTime || "N/A"}</td>
                            <td>
                              <button 
                                onClick={() => handleDelete(stop.id)}
                                style={{
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  fontWeight: 500
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Add Stop Form */}
              <div className="stops-card">
                <div className="stops-card-header">Add New Stop</div>
                <form onSubmit={handleSubmit} className="stops-form-body">
                  <div className="stop-form-group">
                    <label>Stop Name *</label>
                    <input 
                      type="text" 
                      name="stopName" 
                      value={formData.stopName} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. Lonavala Toll Plaza"
                    />
                  </div>

                  <div className="stop-form-group">
                    <label>Stop Sequence Order *</label>
                    <input 
                      type="number" 
                      name="stopOrder" 
                      value={formData.stopOrder} 
                      onChange={handleInputChange} 
                      required 
                      min="1"
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div className="stop-form-group">
                    <label>Arrival Time</label>
                    <input 
                      type="time" 
                      name="arrivalTime" 
                      value={formData.arrivalTime} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="stop-form-group">
                    <label>Departure Time</label>
                    <input 
                      type="time" 
                      name="departureTime" 
                      value={formData.departureTime} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-submit-stop"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Stop"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}