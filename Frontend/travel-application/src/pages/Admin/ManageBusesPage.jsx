import React, { useState, useEffect } from "react";
import { 
  Search, Bell, LayoutDashboard, Bus, Users, Settings, LogOut, 
  Eye, Filter, X, Edit, Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BrowsePackagesPage.css"; 

export default function ManageBusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to hold dynamic user data for the top right corner
  const [userInfo, setUserInfo] = useState({ name: "Loading...", role: "", initials: ".." });
  
  // Search states
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const hasAccess = verifyAdminRole();
    if (hasAccess) {
      fetchBuses();
    }
  }, []);

  const verifyAdminRole = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      const userRole = decodedPayload.user_role;
      
      if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
        alert("Access Denied: You do not have administrator privileges.");
        navigate("/Admin-Dashboard");
        return false;
      }
      
      // --- NEW: Extract and format user data for header ---
      // Spring Boot typically stores the username/email in the "sub" (subject) claim
      const rawName = decodedPayload.sub || "Admin User";
      
      // If it's an email (e.g., admin@travel.com), this extracts just the "admin" part
      const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
      
      // Clean up role text (changes "ROLE_ADMIN" to just "Admin")
      const displayRole = userRole.replace("ROLE_", "");
      const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1).toLowerCase();
      
      // Get first two letters for the circular avatar (e.g., "admin" -> "AD")
      const initials = displayName.substring(0, 2).toUpperCase();
      
      setUserInfo({ 
        name: displayName, 
        role: formattedRole, 
        initials: initials 
      });
      // ---------------------------------------------------

      return true;
    } catch (err) {
      console.error("Invalid token format:", err);
      localStorage.clear();
      navigate("/login");
      return false;
    }
  };

  const fetchBuses = async () => {

    try {

        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:8080/api/v1/buses",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Request failed with status: ${response.status}`
            );
        }

        const data = await response.json();

        setBuses(data);

    } catch (err) {

        setError(err.message);

    } finally {

        setLoading(false);

    }

};

  const handleDelete = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus? All future bookings will be cancelled and refunded 100%.")) {
      try {
        const token = localStorage.getItem("token"); 
        
        const response = await fetch(`http://localhost:8080/api/v1/buses/${busId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert("Bus successfully deleted and refunds processed.");
          fetchBuses(); 
        } else {
          alert("Failed to delete bus. Unauthorized or forbidden.");
        }
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleView = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBus(null);
  };

  const executeSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const filteredBuses = buses.filter((bus) => {
    if (!searchTerm) return true;

    const query = searchTerm.toLowerCase().trim();
    const name = bus.busName || "";
    const number = bus.busNumber || "";
    
    return name.toLowerCase().includes(query) || number.toLowerCase().includes(query);
  });

  return (
    <div className="manage-packages-layout">
      {/* SIDEBAR */}
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
          <a href="#" className="nav-item active"><Bus size={20} /> Manage Buses</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/packages"); }}><Bus size={20} /> Packages</a>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
          <button className="nav-item logout" onClick={handleLogout} style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="top-navbar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search by bus name or number..." 
                className="search-input" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button 
              type="button"
              className="btn-primary" 
              style={{ padding: '0 16px', borderRadius: '6px' }}
              onClick={executeSearch}
            >
              Search
            </button>
          </div>
          <div className="top-actions">
            <button className="btn-icon"><Bell size={24} /></button>
            <div className="profile-section">
              {/* Dynamic Avatar Initials */}
              <div className="avatar">{userInfo.initials}</div>
              <div>
                {/* Dynamic Username */}
                <div style={{fontWeight: 600, fontSize: '0.875rem', color: '#334155', textTransform: 'capitalize'}}>
                  {userInfo.name}
                </div>
                {/* Dynamic Role */}
                <div style={{fontSize: '0.75rem', color: '#64748b'}}>
                  {userInfo.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Bus</h1>
              <p className="page-subtitle">View and manage all registered buses</p>
            </div>
          </div>

          <div className="table-card">
            <div className="table-toolbar">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="search-bar" style={{ width: '300px', backgroundColor: 'white' }}>
                  <Search className="search-icon" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or number..." 
                    className="search-input" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button 
                  type="button"
                  className="btn-primary" 
                  style={{ padding: '0 16px', borderRadius: '6px' }}
                  onClick={executeSearch}
                >
                  Search
                </button>
              </div>
              <div className="toolbar-filters">
                <button className="btn-icon" style={{border: '1px solid #cbd5e1'}}><Filter size={18}/> Filters</button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bus Name</th>
                    <th>Bus Number</th>
                    <th>Type</th>
                    <th>Total Seats</th>
                    <th>Amenities</th>
                    <th>Status</th>
                    <th style={{textAlign: 'center'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="7" className="loading-state">Loading buses...</td></tr>}
                  {error && <tr><td colSpan="7" className="error-state">Error: {error}</td></tr>}
                  {!loading && !error && filteredBuses.length === 0 && (
                    <tr><td colSpan="7" className="empty-state">No buses match "{searchTerm}".</td></tr>
                  )}
                  
                  {filteredBuses.map((bus) => {
                    const status = bus.status || "UNKNOWN";
                    const statusClass = status === 'ACTIVE' ? 'status-active' 
                                      : status === 'INACTIVE' ? 'status-cancelled' 
                                      : 'status-completed';

                    return (
                      <tr key={bus.id}>
                        <td style={{fontWeight: 600, color: '#1e293b'}}>{bus.busName || "N/A"}</td>
                        <td style={{fontWeight: 500}}>{bus.busNumber || "N/A"}</td>
                        <td>{bus.busType || "N/A"}</td>
                        <td>{bus.totalSeats || 0}</td>
                        <td style={{fontSize: '0.85rem', color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                          {bus.amenities || "None"}
                        </td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div style={{display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center'}}>
                            <button className="btn-icon" title="View Details" onClick={() => handleView(bus)}>
                              <Eye size={18} />
                            </button>
                            <button className="btn-icon" title="Edit Bus">
                              <Edit size={18} />
                            </button>
                            <button 
                              className="btn-icon delete" 
                              title="Delete Bus"
                              onClick={() => handleDelete(bus.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Overlay & Content */}
        {isModalOpen && selectedBus && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header">
                <h2>Bus Details</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-header-row">
                  <div>
                    <h3 className="detail-title">{selectedBus.busName}</h3>
                    <p className="detail-subtitle">{selectedBus.busNumber} • {selectedBus.busType}</p>
                  </div>
                  <span className={`status-badge ${selectedBus.status === 'ACTIVE' ? 'status-active' : 'status-cancelled'}`}>
                    {selectedBus.status}
                  </span>
                </div>

                <div className="detail-section">
                  <h4>Amenities</h4>
                  <p>{selectedBus.amenities || "No amenities listed for this bus."}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="item-label">Bus ID</span>
                    <span className="item-value">#{selectedBus.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Total Seats</span>
                    <span className="item-value">{selectedBus.totalSeats}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Bus Type</span>
                    <span className="item-value">{selectedBus.busType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}