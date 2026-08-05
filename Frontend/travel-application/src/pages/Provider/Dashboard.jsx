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
  CalendarDays,
  Bell,
  CheckCircle2,
  Armchair,
} from "lucide-react";
import api from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // Convert providerName to state, defaulting to localStorage while it loads
  const [providerName, setProviderName] = useState(
    localStorage.getItem("userName") || "Bus Provider",
  );

  const userId = localStorage.getItem("userId");

  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    todaysTrips: 0,
    seatsBookedToday: 0,
  });
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveDashboardData = async () => {
      // Safeguard: Check if userId exists in localStorage
      if (!userId) {
        console.error(
          "🔴 MISSING ID: No 'userId' found in localStorage. Please log in again.",
        );
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // ==========================================
      // 1. Fetch Provider Details (Actual Company Name)
      // ==========================================
      try {
        const providerResponse = await api.get(`/api/v1/providers/${userId}`, {
          headers,
        });
        if (providerResponse.data) {
          // Look for companyName, fallback to standard name if not present
          const actualName =
            providerResponse.data.companyName || providerResponse.data.name;
          if (actualName) {
            setProviderName(actualName);
            // Optionally update localStorage so other pages have the actual name instantly
            localStorage.setItem("name", actualName);
          }
        }
      } catch (error) {
        console.error("🔴 PROVIDER API ERROR:", error);
      }

      // ==========================================
      // 2. Fetch Stats (ISOLATED TRY/CATCH)
      // ==========================================
      try {
        const statsResponse = await api.get(
          `/api/v1/providers/${userId}/dashboard/stats`,
          { headers },
        );

        if (statsResponse.data) {
          setStats({
            totalBuses: statsResponse.data.totalBuses || 0,
            activeBuses: statsResponse.data.activeBuses || 0,
            todaysTrips: statsResponse.data.todaysTrips || 0,
            seatsBookedToday: statsResponse.data.seatsBookedToday || 0,
          });
        }
      } catch (error) {
        console.error("🔴 STATS API ERROR:", error);
        setStats({
          totalBuses: 0,
          activeBuses: 0,
          todaysTrips: 0,
          seatsBookedToday: 0,
        });
      }

      // ==========================================
      // 3. Fetch Upcoming Departures (ISOLATED TRY/CATCH)
      // ==========================================
      try {
        const departuresResponse = await api.get(
          `/api/v1/providers/${userId}/schedules/upcoming`,
          { headers },
        );

        if (departuresResponse.data) {
          setDepartures(departuresResponse.data);
        }
      } catch (error) {
        console.error("🔴 DEPARTURES API ERROR:", error);
        setDepartures([]); // Only reset departures if this specific call fails
      }

      // Turn off the loading spinner after all attempts finish
      setLoading(false);
    };

    fetchLiveDashboardData();
  }, [userId]);

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === "BOARDING")
      return <span className="badge badge-warning">Boarding</span>;
    if (s === "READY")
      return <span className="badge badge-success">Ready</span>;
    if (s === "ON TIME" || s === "ON_TIME")
      return <span className="badge badge-info">On Time</span>;
    if (s === "DELAYED")
      return <span className="badge badge-danger">Delayed</span>;
    return <span className="badge badge-default">{status || "UNKNOWN"}</span>;
  };

  // Helper to generate initials dynamically for the avatar
  const getInitials = (name) => {
    if (!name) return "BP";
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
          <button className="nav-item active">
            <Home size={20} /> Dashboard
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/provider/buses")}
          >
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
          <div className="header-actions">
            <span className="date-picker">
              <CalendarDays size={16} className="text-gray" />
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="notification-bell">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </div>
            <div className="provider-profile">
              <div className="avatar">{getInitials(providerName)}</div>
              <div className="profile-info">
                <strong>{providerName}</strong>
                <span>Provider</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-header-text">
          <h1>Welcome back, {providerName}! 👋</h1>
          <p>Here's what's happening with your business today.</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading your dashboard...</div>
        ) : (
          <div className="dashboard-body">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <p>Total Buses</p>
                  <h3>{stats.totalBuses}</h3>
                  <a href="#buses" onClick={() => navigate("/provider/buses")}>
                    View all buses
                  </a>
                </div>
                <div className="stat-icon bg-teal">
                  <Bus size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Active Buses</p>
                  <h3>{stats.activeBuses}</h3>
                  <span className="sub-text">Currently active</span>
                </div>
                <div className="stat-icon bg-green">
                  <CheckCircle2 size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Today's Trips</p>
                  <h3>{stats.todaysTrips}</h3>
                  <span className="sub-text">Scheduled for today</span>
                </div>
                <div className="stat-icon bg-orange">
                  <CalendarDays size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Seats Booked Today</p>
                  <h3>{stats.seatsBookedToday}</h3>
                  <span className="sub-text">Across all trips</span>
                </div>
                <div className="stat-icon bg-blue">
                  <Armchair size={24} />
                </div>
              </div>
            </div>

            {/* Departures Table */}
            <div className="departures-section">
              <div className="section-header">
                <h3>Upcoming Departures</h3>
                <a
                  href="#trips"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/provider/trips/schedule");
                  }}
                >
                  View all trips &gt;
                </a>
              </div>

              <div className="table-responsive">
                <table className="departures-table">
                  <thead>
                    <tr>
                      <th>Bus</th>
                      <th>Route</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Booked / Total Seats</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departures.length > 0 ? (
                      departures.map((dep, index) => (
                        <tr key={dep.id || index}>
                          <td>
                            <strong>{dep.busNumber}</strong>
                          </td>
                          <td>{dep.route}</td>
                          <td>{dep.departureTime}</td>
                          <td>{dep.arrivalTime}</td>
                          <td>
                            {dep.bookedSeats} / {dep.totalSeats}
                          </td>
                          <td>{getStatusBadge(dep.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No upcoming departures found.
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

export default Dashboard;
