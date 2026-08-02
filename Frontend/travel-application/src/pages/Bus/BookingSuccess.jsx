import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingSuccess.css";
import {
  FaCheck,
  FaDownload,
  FaCalendarAlt,
  FaShareAlt,
  FaHeadset,
  FaTag,
  FaSuitcase,
} from "react-icons/fa";

const BookingSuccess = () => {
  const navigate = useNavigate();

  // Dummy data (Replace these with actual data from your state/backend)
  const bookingData = {
    bookingId: "THB987654321",
    email: "vaishnavnakate@gmail.com",
    phone: "+91 98765 43210",
  };

  return (
    <div className="booking-success-wrapper">
      <div className="success-container">
        {/* Left Column: Main Success Info & Banner */}
        <div className="success-main-column">
          {/* Success Header */}
          <div className="success-header">
            <div className="check-circle">
              <FaCheck className="check-icon" />
            </div>
            <h1 className="success-title">Booking Confirmed! 🎉</h1>
            <p className="success-subtitle">
              Your bus ticket has been booked successfully.
              <br />
              We've sent the details to <strong>
                {bookingData.email}
              </strong> and <strong>{bookingData.phone}</strong>
            </p>

            <div className="booking-id-box">
              <span>Booking ID:</span> <strong>{bookingData.bookingId}</strong>
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
                <p>
                  Use code: <strong>TRAVEL5</strong> on your next trip.
                </p>
              </div>
            </div>
            <button
              className="book-another-btn"
              onClick={() => navigate("/home")}
            >
              Book Another Trip
            </button>
          </div>

          {/* Footer Greeting */}
          <div className="success-footer-greeting">
            <p>❤️ Thank you for travelling with TravelHub.</p>
            <span>Wishing you a safe and comfortable journey!</span>
          </div>
        </div>

        {/* Right Column: Actions & Support */}
        <div className="success-sidebar-column">
          {/* Thank You Promo Card */}
          <div className="thank-you-card">
            <div className="thank-you-text">
              <p>Thank you for choosing</p>
              <h3>TravelHub</h3>
            </div>
            {/* Using a placeholder image similar to the bus illustration */}
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80"
              alt="Travel Bus"
              className="thank-you-bg-img"
            />
          </div>

          {/* What's Next Card */}
          <div className="whats-next-card">
            <h3 className="card-title">What's Next?</h3>
            <div className="action-list">
              <div className="action-item">
                <div className="action-icon-wrapper text-teal">
                  <FaDownload />
                </div>
                <div className="action-text">
                  <strong>Download Ticket</strong>
                  <p>Get your e-ticket</p>
                </div>
              </div>

              <div className="action-item">
                <div className="action-icon-wrapper text-teal">
                  <FaSuitcase />
                </div>
                <div className="action-text">
                  <strong>View My Bookings</strong>
                  <p>Check your trip details</p>
                </div>
              </div>

              <div className="action-item">
                <div className="action-icon-wrapper text-teal">
                  <FaCalendarAlt />
                </div>
                <div className="action-text">
                  <strong>Add to Calendar</strong>
                  <p>Save trip to calendar</p>
                </div>
              </div>

              <div className="action-item">
                <div className="action-icon-wrapper text-teal">
                  <FaShareAlt />
                </div>
                <div className="action-text">
                  <strong>Share Trip Details</strong>
                  <p>Share with your friends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help Card */}
          <div className="need-help-card">
            <div className="help-header">
              <div className="help-icon-wrapper">
                <FaHeadset />
              </div>
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
