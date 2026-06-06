import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BusDetails.css";

export default function BusDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting data passed via React Router navigation state
  const { bus, from, to, date } = location.state || {};

  // Component States
  const [activeTab, setActiveTab] = useState("seats"); // 'seats' or 'points'
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);

  if (!bus) {
    return (
      <div className="no-data">
        <h2>No Bus Data Found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  // Uniform seat mapping layout arrangement
  const totalSeats = [
    { id: "1A", status: "sold", price: 499 },
    { id: "1B", status: "available", price: 499 },
    { id: "1C", status: "sold", price: 499 },
    { id: "1D", status: "sold", price: 499 },
    
    { id: "2A", status: "sold", price: 449 },
    { id: "2B", status: "available", price: 449 },
    { id: "2C", status: "available", price: 449 },
    { id: "2D", status: "sold", price: 449 },
    
    { id: "3A", status: "available", price: 449 },
    { id: "3B", status: "available", price: 449 },
    { id: "3C", status: "sold", price: 449 },
    { id: "3D", status: "available", price: 449 },
    
    { id: "4A", status: "sold", price: 449 },
    { id: "4B", status: "available", price: 449 },
    { id: "4C", status: "available", price: 449 },
    { id: "4D", status: "available", price: 449 },
    
    { id: "5A", status: "available", price: 449 },
    { id: "5B", status: "available", price: 449 },
    { id: "5C", status: "sold", price: 449 },
    { id: "5D", status: "available", price: 449 },
  ];

  const boardingPoints = [
    { id: "b1", time: "21:30", name: "SWARGATE - Purple Tr Mitramandal Chowk", location: "Shraddha Lodge Pune, Maharashtra" },
    { id: "b2", time: "22:00", name: "Paud Road - More Vidyalay chowk", location: "Near Sujata Mastani, Pune, Maharashtra" },
    { id: "b3", time: "22:05", name: "Lenskart Store", location: "Opp Kinara Hotel Paud road Pune, Maharashtra" }
  ];

  const droppingPoints = [
    { id: "d1", time: "00:10", name: "Kalamboli - Opp. McDonald", location: "On Highway Navi Mumbai, Maharashtra" },
    { id: "d2", time: "00:15", name: "Kharghar Drop Little world Mall", location: "Highway Panvel, Maharashtra" },
    { id: "d3", time: "00:20", name: "CBD Belapur Below Flyover", location: "Navi Mumbai, Maharashtra" }
  ];

  const handleSeatClick = (seat) => {
    if (seat.status === "sold") return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  return (
    <div className="bus-details-container">
      {/* Route Header Navigation Row */}
      <div className="route-summary-bar">
  <div>
    <span className="route-text">{from || "Mumbai"} → {to || "Pune"}</span>
    {/* Use the date variable here! */}
    {date && <span className="date-text"> | {date}</span>} 
  </div>
  <button className="close-btn" onClick={() => navigate(-1)}>✕</button>
</div>

      {/* Tab Controls Menu */}
      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === "seats" ? "active" : ""}`}
          onClick={() => setActiveTab("seats")}
        >
          Select seats
        </button>
        <button 
          className={`tab-btn ${activeTab === "points" ? "active" : ""}`}
          onClick={() => setActiveTab("points")}
        >
          Board/Drop point
        </button>
      </div>

      {/* Main Container Views Switcher */}
      <div className="tab-content-wrapper">
        
        {/* PANEL A: SEAT CONFIGURATION MATRICES */}
        {activeTab === "seats" && (
          <div className="seats-layout-view">
            
            {/* Left Box Component: The Bus Cabin Wrapper */}
            <div className="bus-cabin-grid">
              <div className="steering-wheel-wrapper">
                <span className="steering-icon">☸</span>
              </div>
              
              <div className="seats-matrix">
                {totalSeats.map((seat, index) => {
                  // Check if this seat is the third item in the row sequence (index 2, 6, 10, etc.)
                  const isRightSideStart = index % 4 === 2;

                  return (
                    <React.Fragment key={seat.id}>
                      {/* Injecting an explicit empty grid unit cell to map the middle aisle layout column */}
                      {isRightSideStart && <div className="cabin-aisle-space" />}
                      
                      <button
                        disabled={seat.status === "sold"}
                        className={`seat-unit ${seat.status} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        <span className="seat-label">{seat.id}</span>
                        <span className="seat-price-tag">₹{seat.price}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Right Box Component: Legends and Checkout Summaries */}
            <div className="seats-sidebar-info">
              <h3>Seat Legend & Info</h3>
              <div className="legend-box">
                <div className="legend-item"><span className="indicator sold"></span> Sold</div>
                <div className="legend-item"><span className="indicator available"></span> Available</div>
                <div className="legend-item"><span className="indicator selected-legend"></span> Selected</div>
              </div>
              <hr />
              <div className="summary-billing">
                <p><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                <p><strong>Operator:</strong> {bus.operator || "VRL Travels"}</p>
                <p><strong>Bus Type:</strong> {bus.type || "AC Sleeper (2+1)"}</p>
                <button 
                  className="continue-booking-btn"
                  disabled={selectedSeats.length === 0}
                  onClick={() => setActiveTab("points")}
                >
                  Next: Choose Boarding Point
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL B: SCHEDULED PICKUP STOPS SELECTION */}
        {activeTab === "points" && (
          <div className="points-selection-view">
            {/* Left List Column: Pickups */}
            <div className="points-column">
              <h3>Boarding Points</h3>
              {boardingPoints.map((pt) => (
                <label key={pt.id} className={`point-card ${selectedBoarding === pt.id ? "checked" : ""}`}>
                  <input 
                    type="radio" 
                    name="boarding" 
                    checked={selectedBoarding === pt.id}
                    onChange={() => setSelectedBoarding(pt.id)} 
                  />
                  <div className="point-details">
                    <span className="time">{pt.time}</span>
                    <span className="name">{pt.name}</span>
                    <span className="sub">{pt.location}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Right List Column: Drop Offs */}
            <div className="points-column">
              <h3>Dropping Points</h3>
              {droppingPoints.map((pt) => (
                <label key={pt.id} className={`point-card ${selectedDropping === pt.id ? "checked" : ""}`}>
                  <input 
                    type="radio" 
                    name="dropping" 
                    checked={selectedDropping === pt.id}
                    onChange={() => setSelectedDropping(pt.id)} 
                  />
                  <div className="point-details">
                    <span className="time">{pt.time}</span>
                    <span className="name">{pt.name}</span>
                    <span className="sub">{pt.location}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Checkout Summary Drawer */}
      {(selectedBoarding && selectedDropping && selectedSeats.length > 0) && (
        <div className="checkout-sticky-footer">
          <div>
            <h4>Ready to Proceed</h4>
            <p>{selectedSeats.length} Seat(s) Selected ({selectedSeats.join(", ")})</p>
          </div>
          <button 
            className="final-submit-btn"
            onClick={() => {
              // 1. Calculate the total price of the selected seats
              const totalAmount = selectedSeats.reduce((total, seatId) => {
                const seatInfo = totalSeats.find(s => s.id === seatId);
                return total + (seatInfo ? seatInfo.price : 0);
              }, 0);

              // 2. Navigate to the payment page and pass all the data!
              navigate("/payment", { 
                state: { 
                  bus, 
                  selectedSeats, 
                  selectedBoarding, 
                  selectedDropping,
                  from,
                  to,
                  date,
                  totalAmount
                } 
              });
            }}
          >
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
}