import { useNavigate } from "react-router-dom";
import "../App.css"; // Ensure your CSS is imported if needed

export default function Confirmation() {
  // Initialize the router navigation hook
  const navigate = useNavigate();

  return (
    <div className="page-container center-content">
      <div className="card confirmation-card">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your payment was successful. Have a great journey!</p>
        </div>

        <div className="ticket-body">
          <div className="ticket-header">
            <div>
              <span className="label">Booking ID / PNR</span>
              <span className="pnr-text">TRV849201X</span>
            </div>
            <div className="text-right">
              <span className="label">Travel Operator</span>
              <span className="value font-bold">VRL Travels</span>
            </div>
          </div>

          <div className="journey-timeline">
            <div className="station">
              <h3>BOM</h3>
              <p className="city">Mumbai</p>
              <p className="time">08:00 AM</p>
            </div>
            
            <div className="timeline-line">
              <span className="duration-badge">6h 30m</span>
            </div>
            
            <div className="station">
              <h3>PNQ</h3>
              <p className="city">Pune</p>
              <p className="time">02:30 PM</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary">Download E-Ticket</button>
            {/* Updated onClick to use the router navigation! */}
            <button className="btn-secondary" onClick={() => navigate("/my-bookings")}>
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}