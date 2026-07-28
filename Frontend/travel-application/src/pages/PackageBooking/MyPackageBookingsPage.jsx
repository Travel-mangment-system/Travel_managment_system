import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BsGrid1X2, 
  BsSuitcase, 
  BsJournalCheck, 
  BsBoxArrowRight, 
  BsSearch, 
  BsBell,
  BsXCircle,
  BsClockHistory,
  BsCashCoin,
  BsShieldCheck
} from "react-icons/bs";
import "./MyPackageBookingsPage.css"; 

export default function MyPackageBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userName = localStorage.getItem("name") || "User";
  const userId = localStorage.getItem("userId") || localStorage.getItem("id"); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId) {
      fetchMyBookings();
    } else {
      console.error("No User ID found in localStorage. Bookings cannot be fetched.");
      setLoading(false);
    }
  }, [userId]);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      // Points to PackageBookingController
      const response = await fetch(`http://localhost:8080/api/packageBooking/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched My Bookings:", data); 
        setBookings(data);
      } else {
        console.error("Failed to load bookings. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this package? As per our policy, user-initiated cancellations will receive an 80% refund. This action cannot be undone."
    );

    if (!confirmCancel) return;

    try {
      // Points to PackageBookingController cancellation route with security verification
      const response = await fetch(`http://localhost:8080/api/packageBooking/${bookingId}/cancel/user/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const refundData = await response.json();
        alert(`${refundData.message} Refund Amount: ₹${refundData.refundAmount}`);
        fetchMyBookings(); // Refresh the list after cancellation
      } else {
        const errorText = await response.text();
        alert(`Failed to cancel booking: ${errorText}`);
      }
    } catch (error) {
      console.error("Cancellation Error:", error);
      alert("An error occurred while trying to cancel the booking.");
    }
  };

  return (
    <div className="mypkg-layout">
      
      {/* SIDEBAR */}
      <aside className="mypkg-sidebar">
        <div className="mypkg-sidebar-header">
          <BsSuitcase size={24} style={{ color: "#0E8A8A" }} />
          <span style={{ color: "white", fontSize: "1.25rem", fontWeight: "700", letterSpacing: "0.025em" }}>TravelHub</span>
        </div>
        
        <div className="mypkg-sidebar-title">Menu</div>
        
        <nav className="mypkg-sidebar-nav">
          <a href="#home" className="mypkg-nav-item" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>
            <BsGrid1X2 size={20} /> Home
          </a>
          <a href="#my-package-bookings" className="mypkg-nav-item mypkg-active" onClick={(e) => e.preventDefault()}>
            <BsJournalCheck size={20} /> My Package Bookings
          </a>
        </nav>
        
        <div className="mypkg-sidebar-footer">
          <a href="#logout" className="mypkg-nav-item mypkg-logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <BsBoxArrowRight size={20} /> Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="mypkg-main-content">
        
        {/* TOP NAVBAR */}
        <header className="mypkg-top-navbar">
          <div className="mypkg-search-bar">
            <BsSearch size={18} color="#64748b" />
            <input type="text" placeholder="Search packages..." className="mypkg-search-input" />
          </div>
          
          <div className="mypkg-top-actions">
            <BsBell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
            <div className="mypkg-profile-section">
              <span className="mypkg-profile-name">{userName}</span>
              <div className="mypkg-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* BOOKINGS CONTENT */}
        <main className="mypkg-page-container">
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <BsClockHistory size={40} style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
              <p>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mypkg-summary-wrapper" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <BsSuitcase size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h2 style={{ color: '#334155', marginBottom: '0.5rem' }}>No bookings found</h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You haven't booked any holiday packages yet.</p>
              
              <button 
                onClick={() => navigate("/home")} 
                style={{ backgroundColor: '#128f8f', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                Home
              </button>
            </div>
          ) : (
            <div>
              <h1 style={{ color: '#0f172a', fontSize: '1.8rem', marginBottom: '2rem', marginLeft: 'auto', marginRight: 'auto', maxWidth: '850px' }}>
                My Package Bookings
              </h1>
              
              {bookings.map((booking) => {
                const status = booking.bookingStatus || 'CONFIRMED';
                const amount = booking.totalAmountPaid || 0;
                const packageTitle = booking.packageTitle || 'Holiday Package';
                const isCanceled = status === 'CANCELLED' || status === 'CANCELED';

                return (
                  <div key={booking.bookingId} className="mypkg-summary-wrapper">
                    
                    <div className="mypkg-summary-header" style={{ paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                      <h2>Booking #{booking.bookingId}</h2>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        backgroundColor: isCanceled ? '#fee2e2' : '#ccfbf1',
                        color: isCanceled ? '#ef4444' : '#0f766e'
                      }}>
                        {status}
                      </span>
                    </div>

                    <div className="mypkg-summary-grid">
                      
                      {/* Booking Details */}
                      <div className="mypkg-summary-card">
                        <h3><BsSuitcase className="mypkg-icon-align" /> {packageTitle}</h3>
                        
                        <div className="mypkg-detail-row">
                          <span>Travelers:</span>
                          <strong>{booking.numberOfTravelers || 1}</strong>
                        </div>

                        {booking.paymentId && (
                          <div className="mypkg-detail-row">
                            <span><BsShieldCheck /> Payment ID:</span>
                            <strong style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.paymentId}</strong>
                          </div>
                        )}
                      </div>

                      {/* Payment Summary */}
                      <div className="mypkg-summary-card mypkg-highlight-card">
                        <h3><BsCashCoin className="mypkg-icon-align" /> Payment Summary</h3>
                        <div className="mypkg-detail-row mypkg-total-row" style={{ marginTop: '1rem' }}>
                          <span>Total Paid:</span>
                          <strong className="mypkg-amount">₹{amount}</strong>
                        </div>
                        
                       {!isCanceled && (
                          <button 
                            onClick={() => handleCancelBooking(booking.bookingId)}
                            className="mypkg-cancel-btn"
                          >
                            <BsXCircle size={18} /> Cancel Booking
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}