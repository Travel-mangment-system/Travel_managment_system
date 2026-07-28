import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { 
  Search, Bell, LayoutDashboard, Bus, Users, Settings, LogOut, 
  Eye, Filter, X, Plus, Edit, Trash2
} from "lucide-react";// Added for navigation
import "./BrowsePackagesPage.css";

export default function ManagePackagesPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to hold dynamic user data for the top right corner
  const [userInfo, setUserInfo] = useState({ name: "Loading...", role: "", initials: ".." });

  // Search states
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);


  useEffect(() => {
    // 1. Check if the user is an Admin FIRST
    const hasAccess = verifyAdminRole();
    
    // 2. Only fetch data if they are an Admin
    if (hasAccess) {
      fetchPackages();
    }
  }, []);

  // FRONTEND SECURITY: Decode JWT and verify Admin Role
  const verifyAdminRole = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return false;
    }

    try {
      // Decode the payload part of the JWT
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      const userRole = decodedPayload.user_role;
      
      // If they are not an ADMIN, kick them out
      if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
        alert("Access Denied: You do not have administrator privileges.");
        navigate("/Admin-Dashboard");
        return false;
      }
      
      // Extract and format user data for header
      const rawName = decodedPayload.sub || "Admin User";
      const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
      
      const displayRole = userRole.replace("ROLE_", "");
      const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1).toLowerCase();
      
      const initials = displayName.substring(0, 2).toUpperCase();
      
      setUserInfo({ 
        name: displayName, 
        role: formattedRole, 
        initials: initials 
      });

      return true;
    } catch (err) {
      console.error("Invalid token format:", err);
      localStorage.clear();
      navigate("/login");
      return false;
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); 
      
      const response = await fetch("http://localhost:8080/api/v1/admin/packages", {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
         if (response.status === 401 || response.status === 403) {
             throw new Error("Unauthorized access. Please log in again.");
         }
         throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      
      setPackages(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (packageId) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete this package?\n\n" +
        "• All confirmed bookings will be cancelled.\n" +
        "• Customers will receive a 100% refund.\n" +
        "• This action cannot be undone."
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:8080/api/v1/admin/packages/${packageId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {

            const errorMessage = await response.text();

            throw new Error(
                errorMessage || "Failed to delete package."
            );

        }

       alert("Package deleted successfully.\nAll related confirmed bookings have been cancelled and refunded.");

        // Remove deleted package from table immediately
        setPackages((prevPackages) =>
            prevPackages.filter(
                (pkg) =>
                    (pkg.packageId ||
                        pkg.package_id ||
                        pkg.id) !== packageId
            )
        );

    } catch (error) {

        console.error("Delete Error:", error);

        alert(error.message);

    }

};
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleView = (pkg) => {
    const formattedPkg = {
      id: pkg.packageId || pkg.package_id || "N/A",
      title: pkg.title || pkg.packageTitle || pkg.packageName || pkg.package_title || pkg.package_name || "N/A",
      description: pkg.description || "No description provided for this package.",
      city: pkg.destinationCity || pkg.destination_city || "N/A",
      days: pkg.durationDays || pkg.duration_days || 0,
      nights: pkg.durationNights || pkg.duration_nights || 0,
      depart: formatDate(pkg.departureDatetime || pkg.departure_datetime),
      returnDate: formatDate(pkg.returnDatetime || pkg.return_datetime),
      price: pkg.basePrice || pkg.base_price,
      cap: pkg.totalCapacity || pkg.total_capacity || 0,
      spots: pkg.availableSpots || pkg.available_spots || 0,
      status: pkg.status || pkg.package_status || "UNKNOWN"
    };
    setSelectedPackage(formattedPkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const executeSearch = () => {
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // FILTER LOGIC
  const filteredPackages = packages.filter((pkg) => {
    if (!searchTerm) return true;

    const query = searchTerm.toLowerCase().trim();
    const title = pkg.title || pkg.packageTitle || pkg.packageName || pkg.package_title || pkg.package_name || "";
    
    return title.toLowerCase().includes(query);
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/manage-buses"); }}><Bus size={20} /> Manage Buses</a>
          <a href="#" className="nav-item active"><Bus size={20} /> Packages</a>
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
                placeholder="Search by package title..." 
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
              <h1 className="page-title">Manage Packages</h1>
              <p className="page-subtitle">View and manage all holiday packages</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate("/admin/add-package")}
          >
              <Plus size={18} />
              Add New Package
          </button>
          </div>

          <div className="table-card">
            <div className="table-toolbar">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="search-bar" style={{ width: '300px', backgroundColor: 'white' }}>
                  <Search className="search-icon" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by package title..." 
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
                    <th>Package Title</th>
                    <th>Destination</th>
                    <th>Duration</th>
                    <th>Dates</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th style={{textAlign: 'center'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="8" className="loading-state">Loading packages...</td></tr>}
                  {error && <tr><td colSpan="8" className="error-state">Error: {error}</td></tr>}
                  {!loading && !error && filteredPackages.length === 0 && (
                    <tr><td colSpan="8" className="empty-state">No packages match "{searchTerm}".</td></tr>
                  )}
                  
                  {filteredPackages.map((pkg, index) => {
                    const id = pkg.packageId || pkg.package_id || pkg.id || index;
                    const title = pkg.title || pkg.packageTitle || pkg.packageName || pkg.package_title || pkg.package_name || "N/A";
                    const city = pkg.destinationCity || pkg.destination_city || "N/A";
                    const days = pkg.durationDays || pkg.duration_days || 0;
                    const nights = pkg.durationNights || pkg.duration_nights || 0;
                    const depart = pkg.departureDatetime || pkg.departure_datetime;
                    const returnDate = pkg.returnDatetime || pkg.return_datetime;
                    const price = pkg.basePrice || pkg.base_price;
                    const spots = pkg.availableSpots || pkg.available_spots || 0;
                    const status = pkg.status || pkg.package_status || "UNKNOWN";

                    const displayPrice = price ? price.toLocaleString('en-IN') : "0";
                    const statusClass = status === 'ACTIVE' ? 'status-active' 
                                      : status === 'CANCELLED' ? 'status-cancelled' 
                                      : 'status-completed';

                    return (
                      <tr key={id}>
                        <td style={{fontWeight: 600, color: '#1e293b'}}>{title}</td>
                        <td>{city}</td>
                        <td>{days}D / {nights}N</td>
                        <td style={{fontSize: '0.85rem'}}>
                          {formatDate(depart)} <br/>
                          <span style={{color: '#94a3b8'}}>to</span> {formatDate(returnDate)}
                        </td>
                        <td style={{fontWeight: 700, color: '#0f172a'}}>₹{displayPrice}</td>
                        <td>
                          <span style={{color: '#16a34a', fontWeight: 500, fontSize: '0.9rem'}}>{spots} Left</span>
                        </td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div style={{display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center'}}>
                            <button className="btn-icon" title="View Details" onClick={() => handleView(pkg)}>
                              <Eye size={18} />
                            </button>
                            <button className="btn-icon" title="Edit Package">
                              <Edit size={18} />
                            </button>
                            <button 
                              className="btn-icon delete" 
                              title="Delete Package"
                              onClick={() => handleDelete(id)}
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
        {isModalOpen && selectedPackage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header">
                <h2>Package Details</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-header-row">
                  <div>
                    <h3 className="detail-title">{selectedPackage.title}</h3>
                    <p className="detail-subtitle">{selectedPackage.city} • {selectedPackage.days} Days, {selectedPackage.nights} Nights</p>
                  </div>
                  <span className={`status-badge ${selectedPackage.status === 'ACTIVE' ? 'status-active' : 'status-cancelled'}`}>
                    {selectedPackage.status}
                  </span>
                </div>

                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{selectedPackage.description}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="item-label">Price per person</span>
                    <span className="item-value">₹{selectedPackage.price ? selectedPackage.price.toLocaleString('en-IN') : "0"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Package ID</span>
                    <span className="item-value">#{selectedPackage.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Departure Date</span>
                    <span className="item-value">{selectedPackage.depart}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Return Date</span>
                    <span className="item-value">{selectedPackage.returnDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Availability</span>
                    <span className="item-value">{selectedPackage.spots} spots left</span>
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