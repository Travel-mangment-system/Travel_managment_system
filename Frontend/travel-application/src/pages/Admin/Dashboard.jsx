import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Bell, LayoutDashboard, Bus, Users, Settings, LogOut, Map, MapPin 
} from "lucide-react";
import { BsBusFront, BsBoxSeam } from "react-icons/bs";
import "./BrowsePackagesPage.css"; 

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State to hold dynamic user data for the top right corner
  const [userInfo, setUserInfo] = useState({ name: "Loading...", role: "", initials: ".." });

  useEffect(() => {
    const verifyUser = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Decode the payload part of the JWT
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        const userRole = decodedPayload.user_role || "USER";
        
        // Extract and format user data for header
        const rawName = decodedPayload.sub || "User";
        const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
        
        const displayRole = userRole.replace("ROLE_", "");
        const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1).toLowerCase();
        
        const initials = displayName.substring(0, 2).toUpperCase();
        
        setUserInfo({ 
          name: displayName, 
          role: formattedRole, 
          initials: initials 
        });

      } catch (err) {
        console.error("Invalid token format:", err);
        localStorage.clear();
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
          <a href="#" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Users size={20} /> Users</a>
          <a href="#" className="nav-item"><Bus size={20} /> Bus Providers</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/manage-buses"); }}><Bus size={20} /> Manage Buses</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/packages"); }}><Bus size={20} /> Packages</a>
          
          {/* PERMANENT ROUTES LINK */}
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/routes"); }}><Map size={20} /> Routes</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/cities"); }}><MapPin size={20} /> Cities</a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/admin/stops"); }}><MapPin size={20} /> Bus Stops</a>
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
                <div style={{fontWeight: 600, fontSize: '0.875rem', color: '#334155'}}>
                  {userInfo.name}
                </div>
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
              <h1 className="page-title">Welcome to TravelHub Dashboard</h1>
              <p className="page-subtitle">Overview of your admin controls and features</p>
            </div>
          </div>

          {/* DASHBOARD ACTION CARDS */}
          <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
            <div 
              onClick={() => navigate("/manage-buses")}
              style={{
                flex: 1, padding: "40px", background: "white", border: "1px solid #e2e8f0", 
                borderRadius: "12px", cursor: "pointer", textAlign: "center", transition: "all 0.3s ease",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"; e.currentTarget.style.transform = "none"; }}
            >
              <BsBusFront size={48} color="#0E8A8A" style={{ marginBottom: "20px" }} />
              <h3 style={{ color: "#1e293b", marginBottom: "8px", fontSize: "1.25rem", fontWeight: 600 }}>Manage Buses</h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>View, edit, or delete registered buses across the platform.</p>
            </div>

            <div 
              onClick={() => navigate("/packages")}
              style={{
                flex: 1, padding: "40px", background: "white", border: "1px solid #e2e8f0", 
                borderRadius: "12px", cursor: "pointer", textAlign: "center", transition: "all 0.3s ease",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"; e.currentTarget.style.transform = "none"; }}
            >
              <BsBoxSeam size={48} color="#FF7A29" style={{ marginBottom: "20px" }} />
              <h3 style={{ color: "#1e293b", marginBottom: "8px", fontSize: "1.25rem", fontWeight: 600 }}>Browse Packages</h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>Explore and manage available travel packages and itineraries.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}