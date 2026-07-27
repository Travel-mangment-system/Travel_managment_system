import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BusCard from "../../components/ui/BusCard";
import "./BusSearch.css";

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get("source") || "Mumbai";
  const destination = searchParams.get("destination") || "Pune";
  const date = searchParams.get("date") || "24 May 2024, Friday";

  const [buses, setBuses] = useState([]);

  // Fetch dummy buses perfectly matching the UI image
  // Fetch buses when the page loads or URL parameters change
  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // This now makes a real HTTP GET request to your backend
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

        {/* Bus List */}
        <div className="bus-list">
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>

        {/* Footer Area */}
        <div className="list-footer">
          <p>Showing 1 to {buses.length} of 25 buses</p>
          <button className="btn-filter">
            <span style={{ fontSize: "18px" }}>≡</span> Sort & Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusSearch;
