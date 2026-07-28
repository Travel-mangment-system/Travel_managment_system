import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  BsGrid1X2, 
  BsSuitcase, 
  BsJournalCheck, 
  BsBoxArrowRight, 
  BsSearch, 
  BsBell,
  BsCheckCircleFill,
  BsReceipt,
  BsPerson,
  BsHouse
} from "react-icons/bs";
import "./PackageBookingPage.css"; 
import "./BookingSummaryPage.css"; 

export default function BookingConfirmedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // This grabs the data passed from the Razorpay success handler
  const confirmationData = location.state;
  const userName = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Defensive fallback if someone types the URL manually
  if (!confirmationData) {
    return (
      <div className="manage-packages-layout">
        <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <h2>No confirmation data found.</h2>
          <p style={{ marginBottom: '20px', color: '#64748b' }}>It looks like you haven't completed a booking yet.</p>
          <button onClick={() => navigate("/home")} className="btn-submit-booking" style={{ width: 'auto', padding: '10px 20px' }}>Go to Home</button>
        </div>
      </div>
    );
  }

  const travelersList = confirmationData.travelers || [];

  return (
    <div className="manage-packages-layout">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <BsSuitcase size={24} className="brand-icon" />
          <span className="brand-text">TravelHub</span>
        </div>
        <div className="sidebar-title">Menu</div>
       <nav className="sidebar-nav">
          <a href="#home" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>
            <BsGrid1X2 size={20} /> Home
          </a>
          <a href="#bookings" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate("/my-package-bookings"); }}>
            <BsJournalCheck size={20} /> My Package Bookings
          </a>
        </nav>
        <div className="sidebar-footer">
          <a href="#logout" className="nav-item logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <BsBoxArrowRight size={20} /> Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        
        {/* TOP NAVBAR */}
        <header className="top-navbar">
          <div className="search-bar">
            <BsSearch size={18} color="#64748b" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="top-actions">
            <BsBell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
            <div className="profile-section">
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
                {userName}
              </span>
              <div className="avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONFIRMATION CONTENT */}
        <main className="page-container">
          <div className="summary-wrapper" style={{ borderTop: '5px solid #10b981' }}>
            
            <div className="summary-header" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <BsCheckCircleFill size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h1 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Successful!</h1>
              <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Your booking is confirmed and ready to go.</p>
            </div>

            <div className="summary-grid">
              
              {/* Payment Receipt Card */}
              <div className="summary-card highlight-card">
                <h3><BsReceipt className="icon-align" /> Transaction Details</h3>
                <div className="detail-row">
                  <span>Payment ID:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#0E8A8A' }}>
                    {confirmationData.paymentId || 'N/A'}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <strong style={{ color: '#10b981' }}>Verified & Confirmed</strong>
                </div>
                <div className="detail-row total-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                  <span>Total Amount Paid:</span>
                  <strong className="amount">₹ {confirmationData.totalAmount || 0}</strong>
                </div>
              </div>

              {/* Booking Details Card */}
              <div className="summary-card">
                <h3><BsSuitcase className="icon-align" /> Booking Details</h3>
                <div className="detail-row">
                  <span>Booking Reference:</span>
                  <strong>#{confirmationData.bookingId || 'N/A'}</strong>
                </div>
                <div className="detail-row">
                  <span>Package ID:</span>
                  <strong>{confirmationData.packageId || 'Unknown Package'}</strong>
                </div>
                <div className="detail-row">
                  <span>Booked By:</span>
                  <strong>{confirmationData.userName || userName}</strong>
                </div>
              </div>

              {/* Travelers Card */}
              <div className="summary-card full-width">
                <h3><BsPerson className="icon-align" /> Travelers Confirmed ({travelersList.length})</h3>
                <div className="traveler-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {travelersList.map((t, index) => (
                    <div key={index} className="traveler-item" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div className="traveler-name" style={{ fontWeight: '600', color: '#1e293b' }}>{t.fullName || 'Unknown Name'}</div>
                      <div className="traveler-meta" style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.age || '?'} yrs • {t.gender || 'N/A'}</div>
                    </div>
                  ))}
                  {travelersList.length === 0 && (
                    <div style={{color: '#64748b', fontSize: '0.9rem'}}>No traveler details provided.</div>
                  )}
                </div>
              </div>

            </div>

            <div className="booking-footer" style={{ marginTop: '2rem', justifyContent: 'center', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-back" 
                onClick={() => navigate("/my-package-bookings")}
                style={{ width: 'auto', padding: '12px 24px' }}
              >
                <BsJournalCheck className="icon-align" /> View My Package Bookings
              </button>
              
              <button 
                type="button" 
                className="btn-submit-booking"
                onClick={() => navigate("/home")}
                style={{ width: 'auto', padding: '12px 24px' }}
              >
                <BsHouse className="icon-align" /> Back to Home
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}