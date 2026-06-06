import { useLocation, useNavigate } from 'react-router-dom';
// Add this import line below! 
// Note: If your CSS file is in the same folder, use './TravelStyles.css' instead
import './TravelStyles.css'; 

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the data passed from the BusDetails page
  // If someone lands here without picking seats, we provide fallback empty data
  const { 
    from = "Mumbai", 
    to = "Pune", 
    date = "Oct 15, 2026", 
    selectedSeats = ["12A", "12B"], 
    totalAmount = 1250 
  } = location.state || {};

  const handlePaymentSubmit = () => {
    // Navigate to confirmation page upon successful payment
    navigate('/confirmation', {
      state: { from, to, date, selectedSeats, totalAmount }
    });
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Secure Checkout</h1>
        
        <div className="grid-layout">
          {/* Order Summary */}
          <div className="card summary-card">
            <h2 className="card-title">Booking Summary</h2>
            
            <div className="summary-row">
              <span className="label">Route</span>
              <span className="value">{from} → {to}</span>
            </div>
            
            <div className="summary-row">
              <span className="label">Date</span>
              <span className="value">{date}</span>
            </div>
            
            <div className="summary-row mb-large">
              <span className="label">Seats</span>
              <span className="value">{selectedSeats.join(", ")} (Sleeper)</span>
            </div>
            
            <div className="summary-total">
              <span>Total Amount</span>
              <span className="highlight-text">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card form-card">
            <h2 className="card-title">Payment Details</h2>
            
            <form>
              <div className="input-group">
                <label>Name on Card</label>
                <input type="text" placeholder="John Doe" />
              </div>
              
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" />
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input type="password" placeholder="•••" />
                </div>
              </div>
              
              <button type="button" className="btn-primary full-width" onClick={handlePaymentSubmit}>
                Pay ₹{totalAmount}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}