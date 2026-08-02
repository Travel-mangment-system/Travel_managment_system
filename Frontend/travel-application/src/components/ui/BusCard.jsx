import React from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/Bus/BusSearch.css";

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  console.log("🔍 ACTUAL BUS DATA FROM BACKEND:", bus);

  const handleSelectSeats = () => {
    navigate(`/buses/${bus.scheduleId}/stops`, {
      state: {
        // Change bus.routeId to bus.RouteId
        routeId: bus.RouteId,
        busDetails: bus,
      },
    });
  };

  // Helper function to format "2024-05-24T18:30:00" into "18:30"
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const dateObj = new Date(dateTimeString);
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bus-card">
      <div className="bus-col-1">
        <h3 className="bus-name">{bus.busName}</h3>
        <span className="bus-type">Bus No: {bus.busNumber}</span>
      </div>

      <div className="bus-col-2">
        {/* Extracts the time from the departureDatetime */}
        <p className="time">{formatTime(bus.departureDatetime)}</p>
        <p className="location">{bus.sourceCity}</p>
      </div>

      <div className="bus-col-3">
        {/* Placeholder duration for now */}
        <p className="duration">Direct</p>
      </div>

      <div className="bus-col-4">
        {/* Extracts the time from the arrivalDatetime */}
        <p className="time">{formatTime(bus.arrivalDatetime)}</p>
        <p className="location">{bus.destinationCity}</p>
      </div>

      <div className="bus-col-5">
        <p className="price">₹{bus.fare}</p>
        <p className="per-seat">per seat</p>
        <p className="seats-left">{bus.availableSeats} Seats Left</p>
        <button onClick={handleSelectSeats} className="btn-select-seats">
          Select Seats
        </button>
      </div>
    </div>
  );
};

export default BusCard;
