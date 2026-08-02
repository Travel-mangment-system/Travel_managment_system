import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Search, Bell, LayoutDashboard, Bus, Users, Settings, LogOut, Map, MapPin
} from "lucide-react";

import "../BrowsePackagesPage.css"; 
import "./RoutePage.css"; 

export default function RoutePage() {
  const navigate = useNavigate();
  
  // Layout State for Top Navbar
  const [userInfo, setUserInfo] = useState({ name: "Loading...", role: "", initials: ".." });

  // Route & City States
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]); // Dynamic cities from database
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceCityId: "",
    destinationCityId: "",
    distanceKm: "",
    baseFare: "",
  });

  const API_URL = "http://localhost:8080/routes";
  const CITIES_API_URL = "http://localhost:8080/api/v1/cities";

  // 1. Fetch User Info for Header
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

  // 2. Fetch Routes and Cities on Mount
  useEffect(() => {
    fetchRoutes();
    fetchCities();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load routes.");
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(CITIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities from database.");
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
    if (formData.sourceCityId === formData.destinationCityId) {
      toast.warning("Source and Destination cities cannot be the same.");
      return;
    }
    setLoading(true);
    const payload = {
      sourceCityId: Number(formData.sourceCityId),
      destinationCityId: Number(formData.destinationCityId),
      distanceKm: Number(formData.distanceKm),
      baseFare: Number(formData.baseFare),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Route created successfully!");
      setFormData({ sourceCityId: "", destinationCityId: "", distanceKm: "", baseFare: "" });
      fetchRoutes(); 
    } catch (error) {
      console.error("Error creating route:", error);
      toast.error("Failed to create route.");
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/Admin-Dashboard"); }}><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Users size={20} /> Users</a>
          <a href="#" className="nav-item"><Bus size={20} /> Bus Providers</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/manage-buses"); }}><Bus size={20} /> Manage Buses</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/packages"); }}><Bus size={20} /> Packages</a>
          {/* Active Routes Tab */}
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate("/admin/routes"); }}><Map size={20} /> Routes</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/cities"); }}><MapPin size={20} /> Cities</a>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
          <button className="nav-item logout" onClick={handleLogout} style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main-content">
        
        {/* TOP NAVBAR */}
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

        {/* ACTUAL ROUTES PAGE CONTENT */}
        <div className="page-container route-page-container" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <header className="route-header">
            <div>
              <h2>Manage Routes</h2>
              <p>Add, view and manage all active routes in the system.</p>
            </div>
          </header>

          <div className="route-content">
            {/* Left Column: Routes Table */}
            <div className="route-table-section">
              <div className="table-card">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Route ID</th>
                      <th>Source City</th>
                      <th>Destination City</th>
                      <th>Distance</th>
                      <th>Base Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">No routes found. Create one to get started.</td>
                      </tr>
                    ) : (
                      routes.map((route) => (
                        <tr key={route.id}>
                          <td className="fw-bold">RTE{route.id}</td>
                          <td>{route.sourceCityName || "N/A"}</td>
                          <td>{route.destinationCityName || "N/A"}</td>
                          <td>{route.distanceKm} km</td>
                          <td>₹{route.baseFare}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Add Route Form */}
            <div className="route-form-section">
              <div className="form-card">
                <h3>Add New Route</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Source City <span>*</span></label>
                    <select name="sourceCityId" value={formData.sourceCityId} onChange={handleInputChange} required>
                      <option value="">Select source city</option>
                      {cities.map((city) => (
                        <option key={`src-${city.id}`} value={city.id}>{city.cityName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Destination City <span>*</span></label>
                    <select name="destinationCityId" value={formData.destinationCityId} onChange={handleInputChange} required>
                      <option value="">Select destination city</option>
                      {cities.map((city) => (
                        <option key={`dest-${city.id}`} value={city.id}>{city.cityName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Distance (km) <span>*</span></label>
                    <input type="number" name="distanceKm" value={formData.distanceKm} onChange={handleInputChange} required min="1" step="0.1" placeholder="e.g. 150" />
                  </div>

                  <div className="form-group">
                    <label>Base Fare (₹) <span>*</span></label>
                    <input type="number" name="baseFare" value={formData.baseFare} onChange={handleInputChange} required min="0" step="0.01" placeholder="e.g. 500.00" />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setFormData({ sourceCityId: "", destinationCityId: "", distanceKm: "", baseFare: "" })}>Clear</button>
                    <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : "Save Route"}</button>
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