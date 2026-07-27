import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StopSelection.css";

const StopSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { routeId, busDetails } = location.state || {};

  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [totalStopsCount, setTotalStopsCount] = useState(0); // <-- Added to track total stops
  const [loading, setLoading] = useState(true);

  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);

  // <-- Added state to hold the dynamic fare -->
  const [calculatedFare, setCalculatedFare] = useState(busDetails?.fare || 0);

  // 1. Fetch Stops from Database
  useEffect(() => {
    const fetchStops = async () => {
      if (!routeId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/bus-stops/route/${routeId}`,
        );
        const data = await response.json();

        // Save the total number of stops for our math formula
        setTotalStopsCount(data.length);

        const midpoint = Math.ceil(data.length / 2);
        const boarding = data.slice(0, midpoint);
        const dropping = data.slice(midpoint);

        setBoardingPoints(boarding);
        setDroppingPoints(dropping);

        if (boarding.length > 0) setSelectedBoarding(boarding[0]);
        if (dropping.length > 0) setSelectedDropping(dropping[0]);
      } catch (error) {
        console.error("Failed to load stops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [routeId]);

  // 2. DYNAMIC FARE CALCULATION (Mirroring your Spring Boot Logic)
  useEffect(() => {
    if (selectedBoarding && selectedDropping && totalStopsCount > 1) {
      const totalRouteFare = busDetails.fare;

      // Calculate total segments (e.g., 5 stops = 4 segments)
      const totalSegments = Math.max(1, totalStopsCount - 1);

      // Calculate segments traveled
      const segmentsTraveled =
        selectedDropping.stopOrder - selectedBoarding.stopOrder;

      // Ensure they didn't select stops in the wrong direction
      if (segmentsTraveled > 0) {
        const farePerSegment = totalRouteFare / totalSegments;
        const exactFare = Math.round(farePerSegment * segmentsTraveled);
        setCalculatedFare(exactFare);
      } else {
        setCalculatedFare(totalRouteFare); // Fallback
      }
    }
  }, [selectedBoarding, selectedDropping, totalStopsCount, busDetails]);

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  if (!busDetails) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Please search for a bus first.
      </div>
    );
  }

  const handleContinue = () => {
    navigate(`/buses/${busId}/seats`, {
      state: {
        boarding: selectedBoarding,
        dropping: selectedDropping,
        calculatedFare: calculatedFare, // <-- Pass the newly calculated fare to the Seat map!
        busDetails: busDetails,
      },
    });
  };

  return (
    <div className="stop-selection-page">
      <div className="stop-selection-container">
        <div className="stepper-wrapper">
          <div className="stepper-line"></div>
          <div className="step active completed">
            <div className="step-circle">✓</div>
            <span className="step-label">Search Buses</span>
          </div>
          <div className="step active current">
            <div className="step-circle">
              <div className="inner-dot"></div>
            </div>
            <span className="step-label">Select Seats</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Passenger Details</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Payment</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="page-header">
          <h2>Select Boarding & Dropping Point</h2>
          <p>Choose your boarding and dropping point to continue</p>
        </div>

        <div className="bus-info-card">
          <div className="bus-identity">
            <h3>{busDetails.busName}</h3>
            <span className="bus-type">Bus No: {busDetails.busNumber}</span>
          </div>
          <div className="bus-timing-row">
            <div className="time-block left">
              <h4>
                {busDetails.departureDatetime
                  ? formatTime(busDetails.departureDatetime.split("T")[1])
                  : "N/A"}
              </h4>
              <p>{busDetails.sourceCity}</p>
            </div>
            <div className="duration-line">
              <span className="line"></span>
              <span className="duration-text">Direct</span>
              <span className="line"></span>
            </div>
            <div className="time-block right">
              <h4>
                {busDetails.arrivalDatetime
                  ? formatTime(busDetails.arrivalDatetime.split("T")[1])
                  : "N/A"}
              </h4>
              <p>{busDetails.destinationCity}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            Loading stops from database...
          </div>
        ) : (
          <div className="stops-grid">
            <div className="stop-column">
              <h4 className="column-title">Boarding Point</h4>
              <div className="stop-list">
                {boardingPoints.length === 0 ? (
                  <p>No boarding points found.</p>
                ) : null}
                {boardingPoints.map((point) => (
                  <label
                    key={point.id}
                    className={`stop-item ${selectedBoarding?.id === point.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="boarding"
                      value={point.id}
                      checked={selectedBoarding?.id === point.id}
                      onChange={() => setSelectedBoarding(point)}
                    />
                    <span className="time">
                      {formatTime(point.departureTime)}
                    </span>
                    <span className="location">{point.stopName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="stop-column">
              <h4 className="column-title">Dropping Point</h4>
              <div className="stop-list">
                {droppingPoints.length === 0 ? (
                  <p>No dropping points found.</p>
                ) : null}
                {droppingPoints.map((point) => (
                  <label
                    key={point.id}
                    className={`stop-item ${selectedDropping?.id === point.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="dropping"
                      value={point.id}
                      checked={selectedDropping?.id === point.id}
                      onChange={() => setSelectedDropping(point)}
                    />
                    <span className="time">
                      {formatTime(point.arrivalTime)}
                    </span>
                    <span className="location">{point.stopName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-action-bar">
        <div className="summary-info">
          <div className="summary-item">
            <span className="label">Selected Route</span>
            <span className="value">
              {busDetails.sourceCity} → {busDetails.destinationCity}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Boarding</span>
            <span className="value">
              {selectedBoarding
                ? `${selectedBoarding.stopName} (${formatTime(selectedBoarding.departureTime)})`
                : "Not selected"}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Dropping</span>
            <span className="value">
              {selectedDropping
                ? `${selectedDropping.stopName} (${formatTime(selectedDropping.arrivalTime)})`
                : "Not selected"}
            </span>
          </div>
        </div>

        <div className="action-right">
          <div className="total-fare-box">
            <span className="label">Base Fare</span>
            {/* Displaying the newly calculated dynamic fare here */}
            <span className="amount">₹{calculatedFare}</span>
            <span className="per-person">Per Person</span>
          </div>
          <button
            className="btn-continue"
            onClick={handleContinue}
            disabled={
              !selectedBoarding ||
              !selectedDropping ||
              selectedDropping?.stopOrder <= selectedBoarding?.stopOrder
            }
          >
            Continue to Seat Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopSelection;
