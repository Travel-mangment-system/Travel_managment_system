import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./BookingSuccess.css";
import {
  FaCheck, FaDownload, FaCalendarAlt, FaShareAlt, FaHeadset, FaTag, FaSuitcase,
} from "react-icons/fa";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { busId } = useParams(); // <-- Extracts the dynamic busId from the URL

  // Dynamically retrieve the state passed from the payment page
  const { 
    bookingId, 
    paymentId, 
    totalPrice, 
    busDetails, 
    boarding, 
    dropping, 
    selectedSeats 
  } = location.state || {};

  const email = localStorage.getItem("email") || "your registered email";
  const phone = localStorage.getItem("mobile") || "your phone number";

  // If someone navigates here directly without booking, send them back
  if (!bookingId) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>No recent booking found.</h2>
        <button onClick={() => navigate("/home")} style={{ padding: "10px 20px", marginTop: "20px" }}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="booking-success-wrapper">
      <div className="success-container">
        
        {/* Left Column: Main Success Info */}
        <div className="success-main-column">
          <div className="success-header">
            <div className="check-circle">
              <FaCheck className="check-icon" />
            </div>
            <h1 className="success-title">Booking Confirmed! 🎉</h1>
            <p className="success-subtitle">
              Your bus ticket has been booked and paid successfully.
              <br />
              We've sent the details to <strong>{email}</strong>
            </p>

            <div className="booking-id-box" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span>Booking ID:</span> <strong>#THB{bookingId}</strong>
              </div>
              <div>
                <span>Transaction ID:</span> <strong>{paymentId}</strong>
              </div>
            </div>
          </div>

          {/* Dynamic Ticket Details Summary */}
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "24px", textAlign: "left" }}>
            <h3 style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "15px", fontSize: "16px" }}>Trip Details</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <strong style={{ fontSize: "18px", color: "#0f172a" }}>{busDetails?.busName || "TravelHub Bus"}</strong>
              <span style={{ fontWeight: "600", color: "#ea580c" }}>₹{totalPrice}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#475569", marginBottom: "15px" }}>
              <span>{boarding?.stopName || boarding?.name || "Boarding Point"}</span>
              <span>→</span>
              <span>{dropping?.stopName || dropping?.name || "Drop Point"}</span>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", fontSize: "13px" }}>
              <strong>Seats ({selectedSeats?.length || 0}): </strong> 
              {selectedSeats?.map(s => s.seatNumber || s.number).join(", ") || "N/A"}
            </div>
          </div>

          {/* Cashback Promo Banner */}
          <div className="cashback-banner">
            <div className="banner-content">
              <div className="tag-icon-wrapper">
                <FaTag className="banner-tag-icon" />
              </div>
              <div className="banner-text">
                <h4>Get 5% Cashback on your next booking!</h4>
                <p>Use code: <strong>TRAVEL5</strong> on your next trip.</p>
              </div>
            </div>
            <button className="book-another-btn" onClick={() => navigate("/buses")}>
              Book Another Trip
            </button>
          </div>
        </div>

        {/* Right Column: Actions & Support */}
        <div className="success-sidebar-column">
          <div className="whats-next-card">
            <h3 className="card-title">What's Next?</h3>
            <div className="action-list">
              <div className="action-item">
                <div className="action-icon-wrapper text-teal"><FaDownload /></div>
                <div className="action-text">
                  <strong>Download Ticket</strong>
                  <p>Get your e-ticket</p>
                </div>
              </div>

              <div className="action-item" onClick={() => navigate("/my-bookings")} style={{ cursor: "pointer" }}>
                <div className="action-icon-wrapper text-teal"><FaSuitcase /></div>
                <div className="action-text">
                  <strong>View My Bookings</strong>
                  <p>Check your trip details</p>
                </div>
              </div>

              <div className="action-item">
                <div className="action-icon-wrapper text-teal"><FaCalendarAlt /></div>
                <div className="action-text">
                  <strong>Add to Calendar</strong>
                  <p>Save trip to calendar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="need-help-card">
            <div className="help-header">
              <div className="help-icon-wrapper"><FaHeadset /></div>
              <strong>Need Help?</strong>
            </div>
            <p>Our support team is here to assist you</p>
            <button className="contact-support-btn">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;