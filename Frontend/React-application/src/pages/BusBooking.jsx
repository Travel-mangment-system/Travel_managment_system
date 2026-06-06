import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BusBooking.css";

export default function PassengerBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting selection details from the previous BusDetails page
  const { bus, selectedSeats, selectedBoarding, selectedDropping, from, to } = location.state || {};

  // If no data is available (e.g., direct URL access), redirect back
  if (!selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="no-booking-data">
        <h2>No Booking Information Found</h2>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  // Base configurations with defaults if state keys are missing
  const operatorName = bus?.operator || "VRL Travels";
  const busType = bus?.type || "AC Sleeper (2+1)";
  const ticketPricePerSeat = selectedSeats.length > 0 ? (bus?.price || 449) : 0;
  
  // Calculate pricing breakdown
  const baseFare = ticketPricePerSeat * selectedSeats.length;
  const gstTax = Math.round(baseFare * 0.05); // 5% GST
  const totalAmount = baseFare + gstTax;

  // Initialize form state for each passenger corresponding to a selected seat
  const [passengers, setPassengers] = useState(
    selectedSeats.map((seatId) => ({
      seatNo: seatId,
      name: "",
      age: "",
      gender: "Male",
    }))
  );

  // Handle contact info input state
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  // Handle passenger input changes
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  // Handle contact details input changes
  const handleContactChange = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  // Form handling logic on confirmation click
  const handlePaymentProceed = (e) => {
    e.preventDefault();

    // Compile everything into a unified transactional booking summary payload
    const bookingSummary = {
      busDetails: { operator: operatorName, type: busType, from, to },
      seats: selectedSeats,
      boarding: selectedBoarding,
      dropping: selectedDropping,
      passengerDetails: passengers,
      contact: contactInfo,
      fareBreakup: { baseFare, gstTax, totalAmount }
    };

    console.log("Proceeding to payment stage with order structural data: ", bookingSummary);
    
    // Navigate to your payment gateway simulation wrapper page
    navigate("/payment", { state: bookingSummary });
  };

  return (
    <div className="booking-container">
      <div className="booking-layout-split">
        
        {/* LEFT COLUMN: FORMS CONTROL REGION */}
        <div className="forms-column-wrapper">
          <h2 className="section-main-title">Passenger Details</h2>
          <form onSubmit={handlePaymentProceed}>
            
            {/* Generate form panels for each selected seat block sequentially */}
            {passengers.map((passenger, index) => (
              <div key={passenger.seatNo} className="passenger-card-form">
                <div className="passenger-card-header">
                  <h4>Passenger {index + 1} <span className="seat-badge">Seat {passenger.seatNo}</span></h4>
                </div>
                
                <div className="passenger-inputs-row">
                  <div className="input-group name-field">
                    <label>Passenger Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      required
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                    />
                  </div>

                  <div className="input-group age-field">
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="100"
                      required
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                    />
                  </div>

                  <div className="input-group gender-field">
                    <label>Gender</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact details section required for communication updates */}
            <div className="passenger-card-form contact-section">
              <div className="passenger-card-header">
                <h4>Contact Details</h4>
              </div>
              <div className="passenger-inputs-row">
                <div className="input-group">
                  <label>Email ID</label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    required
                    value={contactInfo.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit Mobile Number"
                    pattern="[0-9]{10}"
                    required
                    value={contactInfo.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form Submission Action Interface Trigger */}
            <button type="submit" className="payment-proceed-btn">
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: BOOKING AND FARE SIDEBAR BREAKDOWN */}
        <div className="summary-sidebar-wrapper">
          <div className="sticky-summary-sidebar">
            <h3 className="summary-title">Journey Summary</h3>
            
            <div className="summary-travel-card">
              <div className="operator-meta">
                <h4>{operatorName}</h4>
                <p>{busType}</p>
              </div>
              <hr className="divider-line" />
              <div className="route-meta-points">
                <p><strong>From:</strong> {from || "Mumbai"}</p>
                <p><strong>To:</strong> {to || "Pune"}</p>
                <p><strong>Selected Seat(s):</strong> {selectedSeats.join(", ")}</p>
              </div>
            </div>

            <h3 className="summary-title">Fare Breakdown</h3>
            <div className="fare-breakdown-card">
              <div className="fare-line">
                <span>Base Fare ({selectedSeats.length} Seat)</span>
                <span>₹{baseFare}</span>
              </div>
              <div className="fare-line">
                <span>GST Tax (5%)</span>
                <span>₹{gstTax}</span>
              </div>
              <hr className="divider-line" />
              <div className="fare-line total-amount-line">
                <span>Total Payable Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}