import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BusCard from "../../components/ui/BusCard";
import { searchBuses } from "../../services/busService";
import "./BusSearch.css";

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get("source") || "Mumbai";
  const destination = searchParams.get("destination") || "Pune";
  const date = searchParams.get("date") || "24 May 2024, Friday";

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  // Fetch buses when the page loads or URL parameters change
  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // Makes a real HTTP GET request to your backend
        const data = await searchBuses(source, destination, date);

        // Update the state with the real database records
        setBuses(data);
      } catch (error) {
        console.error("Failed to load buses from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination, date]); // Re-run if the user changes search parameters

  return (
    <div className="bus-search-page">
      <div className="bus-search-container">
        {/* Header & Title */}
        <h1 className="page-title">Search Buses</h1>

        {/* Status Stepper exactly matching UI */}
        <div className="stepper-wrapper">
          <div className="stepper-line"></div>

          <div className="step active completed">
            <div className="step-circle">✓</div>
            <span className="step-label">Search</span>
          </div>
          <div className="step active current">
            <div className="step-circle">
              <div className="inner-dot"></div>
            </div>
            <span className="step-label">Select Bus</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Seats</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Passenger</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Payment</span>
          </div>
          <div className="step inactive">
            <div className="step-circle"></div>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        {/* Route Info & Change Search Button */}
        <div className="route-header">
          <div>
            <h2 className="route-title">
              {source} <span className="route-arrow">→</span> {destination}
            </h2>
            <p className="route-date">{date}</p>
          </div>
          <button onClick={() => navigate("/")} className="btn-change-search">
            Change Search
          </button>
        </div>

        {/* Bus List with Loading and Empty States */}
        <div className="bus-list">
          {loading ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}
            >
              Loading buses from database...
            </div>
          ) : buses.length === 0 ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}
            >
              No buses found for this route on this date.
            </div>
          ) : (
            buses.map((bus) => <BusCard key={bus.id} bus={bus} />)
          )}
        </div>

        {/* Footer Area */}
        <div className="list-footer">
          <p>
            Showing {buses.length > 0 ? 1 : 0} to {buses.length} of{" "}
            {buses.length} buses
          </p>
          <button className="btn-filter">
            <span style={{ fontSize: "18px" }}>≡</span> Sort & Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusSearch;
