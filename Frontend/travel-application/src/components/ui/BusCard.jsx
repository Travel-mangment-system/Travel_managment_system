import React from "react";
import "../../pages/Bus/BusSearch.css";

const BusCard = ({ bus }) => {
  return (
    <div className="bus-card">
      {/* Column 1: Bus Name, Rating & Type */}
      <div className="bus-col-1">
        <div className="bus-name-row">
          <h3 className="bus-name">{bus.travelsName}</h3>
          <span className="bus-rating">★ {bus.rating}</span>
        </div>
        <p className="bus-type">{bus.busType}</p>
      </div>

      {/* Column 2: Departure Time & Location */}
      <div className="bus-col-2">
        <p className="time">{bus.departureTime}</p>
        <p className="location">{bus.departureLocation}</p>
      </div>

      {/* Column 3: Duration & Arrow */}
      <div className="bus-col-3">
        <span className="duration-text">{bus.duration}</span>
        <div className="duration-graphic">
          <div className="graphic-line"></div>
          <span className="graphic-arrow">→</span>
          <div className="graphic-line"></div>
        </div>
      </div>

      {/* Column 4: Arrival Time & Location */}
      <div className="bus-col-4">
        <p className="time">{bus.arrivalTime}</p>
        <p className="location">{bus.arrivalLocation}</p>
      </div>

      {/* Column 5: Price & Action */}
      <div className="bus-col-5">
        <p className="price">₹{bus.price}</p>
        <p className="per-seat">per seat</p>
        <p className="seats-left">{bus.seatsLeft} Seats left</p>
        <button className="btn-select-seats">Select Seats</button>
      </div>
    </div>
  );
};

export default BusCard;
