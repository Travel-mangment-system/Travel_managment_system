import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { boarding, dropping, calculatedFare, busDetails } =
    location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seats from the backend SeatController
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/seats/schedule/${busId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setSeats(data.seats);
      } catch (error) {
        console.warn(
          "API not ready or failed. Generating fallback layout from busDetails.",
          error,
        );
        // Fallback: If backend fails, generate standard seats based on totalSeats
        const total = busDetails?.totalSeats || 40;
        const fakeSeats = Array.from({ length: total }, (_, i) => ({
          seatNumber: `S${i + 1}`,
          available: Math.random() > 0.3, // Randomly book some seats for realism
          locked: false,
        }));
        setSeats(fakeSeats);
      } finally {
        setLoading(false);
      }
    };

    if (busDetails) {
      fetchSeats();
    }
  }, [busId, busDetails]);

  if (!busDetails) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Please search for a bus first.
      </div>
    );
  }

  // Handle Seat Selection
  const handleSeatClick = (seat) => {
    if (!seat.available) return; // Cannot click booked seats

    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      // Deselect
      setSelectedSeats(
        selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber),
      );
    } else {
      // Select (Limit to 6 seats max)
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert("You can only select up to 6 seats.");
      }
    }
  };

  // Group seats into columns of 4 for the horizontal bus layout (2 Top, Aisle, 2 Bottom)
  const seatColumns = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatColumns.push(seats.slice(i, i + 4));
  }

  const totalAmount = selectedSeats.length * calculatedFare;

  return (
    <div className="seat-selection-page">
      <div className="seat-selection-container">
        {/* Stepper */}
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
          <h2>Select Your Seats</h2>
          <p>Choose your preferred seats from the layout below</p>
        </div>

        {/* Top Info Card */}
        <div className="bus-info-card shadow-sm">
          <div className="bus-identity">
            <h3>{busDetails.busName}</h3>
            <span className="bus-type">
              {busDetails.busType || "AC Sleeper (2+1)"}
            </span>
          </div>
          <div className="bus-timing-row">
            <div className="time-block left">
              <h4>
                {busDetails.departureDatetime
                  ? busDetails.departureDatetime.split("T")[1].substring(0, 5)
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
                  ? busDetails.arrivalDatetime.split("T")[1].substring(0, 5)
                  : "N/A"}
              </h4>
              <p>{busDetails.destinationCity}</p>
            </div>
          </div>

          <div className="stops-summary">
            <div className="summary-point">
              <span className="label">Boarding Point</span>
              <span className="value">
                {boarding?.stopName} ({boarding?.departureTime?.substring(0, 5)}
                )
              </span>
            </div>
            <div className="summary-point">
              <span className="label">Dropping Point</span>
              <span className="value">
                {dropping?.stopName} ({dropping?.arrivalTime?.substring(0, 5)})
              </span>
            </div>
            <div className="summary-point text-right">
              <span className="label">Base Fare</span>
              <span className="value fare-highlight">₹{calculatedFare}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="box available"></div> Available
          </div>
          <div className="legend-item">
            <div className="box selected"></div> Selected
          </div>
          <div className="legend-item">
            <div className="box booked"></div> Booked
          </div>
          <div className="legend-item">
            <div className="box ladies"></div> Ladies Seat
          </div>
        </div>

        {/* Seat Layout Map */}
        {loading ? (
          <div className="loading-state">Loading seat layout...</div>
        ) : (
          <div className="bus-layout-wrapper">
            <h4 className="deck-title">Lower Deck</h4>
            <div className="bus-body">
              <div className="seat-grid">
                {seatColumns.map((col, colIndex) => (
                  <div key={colIndex} className="seat-column">
                    {/* Top 2 Seats */}
                    <div className="seat-pair">
                      {col[0] && (
                        <button
                          className={`seat ${!col[0].available ? "booked" : ""} ${selectedSeats.some((s) => s.seatNumber === col[0].seatNumber) ? "selected" : ""}`}
                          onClick={() => handleSeatClick(col[0])}
                          disabled={!col[0].available}
                        >
                          {col[0].seatNumber}
                        </button>
                      )}
                      {col[1] && (
                        <button
                          className={`seat ${!col[1].available ? "booked" : ""} ${selectedSeats.some((s) => s.seatNumber === col[1].seatNumber) ? "selected" : ""}`}
                          onClick={() => handleSeatClick(col[1])}
                          disabled={!col[1].available}
                        >
                          {col[1].seatNumber}
                        </button>
                      )}
                    </div>

                    {/* The Aisle Gap */}
                    <div className="aisle-spacer"></div>

                    {/* Bottom 2 Seats */}
                    <div className="seat-pair">
                      {col[2] && (
                        <button
                          className={`seat ${!col[2].available ? "booked" : ""} ${selectedSeats.some((s) => s.seatNumber === col[2].seatNumber) ? "selected" : ""}`}
                          onClick={() => handleSeatClick(col[2])}
                          disabled={!col[2].available}
                        >
                          {col[2].seatNumber}
                        </button>
                      )}
                      {col[3] && (
                        <button
                          className={`seat ${!col[3].available ? "booked" : ""} ${selectedSeats.some((s) => s.seatNumber === col[3].seatNumber) ? "selected" : ""}`}
                          onClick={() => handleSeatClick(col[3])}
                          disabled={!col[3].available}
                        >
                          {col[3].seatNumber}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="driver-cabin">
                <div className="steering-wheel"> steering </div>
                <span>
                  Driver
                  <br />
                  Cabin
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="bottom-action-bar">
        <div className="selection-summary">
          <div className="summary-col">
            <span className="label">Selected Seats</span>
            <span className="value strong">
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.seatNumber).join(", ")
                : "-"}
            </span>
          </div>
          <div className="summary-col">
            <span className="label">Seat Type</span>
            <span className="value strong">Lower Deck</span>
          </div>
        </div>

        <div className="action-right">
          <div className="total-fare-box">
            <span className="label">Total Fare</span>
            <span className="amount">₹{totalAmount}</span>
            <span className="per-person">{selectedSeats.length} Seats</span>
          </div>
          <button
            className="btn-continue"
            disabled={selectedSeats.length === 0}
            onClick={() => {
              // navigate to passenger details, passing all data
              console.log("Proceeding with seats:", selectedSeats);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
