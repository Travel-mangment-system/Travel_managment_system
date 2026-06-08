import { useState } from "react";
// 1. Import Link from react-router-dom
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="brand">TravelSys</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#bookings" className="active-link">
            My Bookings
          </a>
        </div>
      </nav>

      <div className="content-wrapper pt-large">
        <h1 className="page-title">My Bookings</h1>

        <div className="tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={activeTab === "upcoming" ? "tab active-tab" : "tab"}
          >
            Upcoming Trips
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={activeTab === "past" ? "tab active-tab" : "tab"}
          >
            Past Trips
          </button>
        </div>

        <div className="booking-list">
          {activeTab === "upcoming" && (
            <div className="card booking-card">
              <div className="booking-info">
                <div className="status-row">
                  <span className="badge badge-success">CONFIRMED</span>
                  <span className="label">PNR: TRV849201X</span>
                </div>
                <h3>Mumbai → Pune</h3>
                <p>Oct 15, 2026 • 08:00 AM | VRL Travels</p>
              </div>
              <div className="booking-actions">
                <button className="btn-outline">View Details</button>
                <button className="btn-text-danger">Cancel Booking</button>
              </div>
            </div>
          )}

          {activeTab === "past" && (
            <div className="card booking-card past-booking">
              <div className="booking-info">
                <div className="status-row">
                  <span className="badge badge-neutral">COMPLETED</span>
                  <span className="label">PNR: TRV332199B</span>
                </div>
                <h3>Bangalore → Chennai</h3>
                <p>Sep 01, 2026 • 10:30 PM | SRS Travels</p>
              </div>
              <div className="booking-actions">
                <button className="btn-secondary">Book Again</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
