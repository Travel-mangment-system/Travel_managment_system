import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MOCK_BUS_DATABASE = [
  {
    id: 1,
    operator: "VRL Travels",
    type: "AC Sleeper (2+1)",
    departure: "06:30 AM",
    arrival: "11:45 AM",
    price: 850,
    seatsLeft: 14,
    rating: 4.5,
    from: "mumbai",
    to: "pune",
  },
  {
    id: 2,
    operator: "SRS Travels",
    type: "Multi-Axle Semi-Sleeper",
    departure: "08:00 AM",
    arrival: "01:15 PM",
    price: 700,
    seatsLeft: 22,
    rating: 4.2,
    from: "mumbai",
    to: "pune",
  },
  {
    id: 3,
    operator: "National Transport",
    type: "Non-AC Seater",
    departure: "11:15 AM",
    arrival: "04:30 PM",
    price: 450,
    seatsLeft: 3,
    rating: 3.8,
    from: "mumbai",
    to: "pune",
  },
  {
    id: 4,
    operator: "Neeta Tours",
    type: "Scania AC Multi-Axle",
    departure: "09:30 PM",
    arrival: "02:45 AM",
    price: 1100,
    seatsLeft: 19,
    rating: 4.7,
    from: "mumbai",
    to: "pune",
  },
  {
    id: 5,
    operator: "VRL Travels",
    type: "AC Sleeper (2+1)",
    departure: "07:00 AM",
    arrival: "03:00 PM",
    price: 1400,
    seatsLeft: 8,
    rating: 4.6,
    from: "pune",
    to: "bangalore",
  },
  {
    id: 6,
    operator: "SRS Travels",
    type: "Volvo AC Seater",
    departure: "04:30 PM",
    arrival: "11:45 PM",
    price: 1250,
    seatsLeft: 25,
    rating: 4.1,
    from: "pune",
    to: "bangalore",
  },
];

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract search queries from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const fromParam = queryParams.get("from") || "";
  const toParam = queryParams.get("to") || "";
  const dateParam = queryParams.get("date") || "";

  // Filter mock database
  const searchFrom = fromParam.toLowerCase();
  const searchTo = toParam.toLowerCase();
  const searchResults = MOCK_BUS_DATABASE.filter(
    (bus) => searchFrom.includes(bus.from) && searchTo.includes(bus.to),
  );

  return (
    <div style={styles.resultsContainer}>
      <div style={styles.summaryBanner}>
        <div>
          <span style={styles.summaryLabel}>Route:</span>{" "}
          <strong style={{ textTransform: "capitalize" }}>
            {fromParam} → {toParam}
          </strong>
        </div>
        <div>
          <span style={styles.summaryLabel}>Date:</span>{" "}
          <strong>{dateParam}</strong>
        </div>
        <button style={styles.modifySearchBtn} onClick={() => navigate("/")}>
          Modify Search
        </button>
      </div>

      <h2 style={styles.resultsTitle}>
        Available Buses ({searchResults.length})
      </h2>

      {searchResults.length === 0 ? (
        <div style={styles.noResultsCard}>
          <h3>No buses found for this route selection.</h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            Try searching using "Mumbai" and "Pune".
          </p>
          <button style={styles.bookBtn} onClick={() => navigate("/")}>
            Go Back Home
          </button>
        </div>
      ) : (
        <div style={styles.busListContainer}>
          {searchResults.map((bus) => (
            <div key={bus.id} style={styles.busCard}>
              <div style={styles.busInfoCol}>
                <h3 style={styles.operatorName}>{bus.operator}</h3>
                <span style={styles.busTypeTag}>{bus.type}</span>
                <div style={styles.ratingBadge}>★ {bus.rating}</div>
              </div>

              <div style={styles.busTimeCol}>
                <div style={styles.timeRow}>
                  <div>
                    <div style={styles.timeVal}>{bus.departure}</div>
                    <div style={styles.cityLabel}>{fromParam}</div>
                  </div>
                  <div style={styles.routeLine}>
                    <span style={styles.lineDot}></span>
                    <hr style={styles.horizontalLine} />
                    <span style={styles.lineDot}></span>
                  </div>
                  <div>
                    <div style={styles.timeVal}>{bus.arrival}</div>
                    <div style={styles.cityLabel}>{toParam}</div>
                  </div>
                </div>
              </div>

              <div style={styles.busActionCol}>
                <div style={styles.priceTag}>₹{bus.price}</div>
                <div
                  style={{
                    ...styles.seatTag,
                    color: bus.seatsLeft <= 5 ? "#dc2626" : "#059669",
                  }}
                >
                  {bus.seatsLeft} seats left
                </div>
                <button
                  style={styles.bookBtn}
                  onClick={() => alert(`Booking ${bus.operator}`)}
                >
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  resultsContainer: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "sans-serif",
  },
  summaryBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e2530",
    color: "#ffffff",
    padding: "16px 24px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  summaryLabel: { color: "#94a3b8", marginRight: "4px" },
  modifySearchBtn: {
    backgroundColor: "#2d3748",
    color: "#ffffff",
    border: "1px solid #475569",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resultsTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e2530",
    marginBottom: "16px",
  },
  noResultsCard: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  busListContainer: { display: "flex", flexDirection: "column", gap: "16px" },
  busCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr 1fr",
    alignItems: "center",
    gap: "20px",
  },
  busInfoCol: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-start",
  },
  operatorName: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    color: "#1e2530",
  },
  busTypeTag: {
    fontSize: "12px",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  ratingBadge: {
    backgroundColor: "#0a7d71",
    color: "#ffffff",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  busTimeCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  timeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },
  timeVal: { fontSize: "20px", fontWeight: "700", color: "#1e2530" },
  cityLabel: {
    fontSize: "13px",
    color: "#64748b",
    textTransform: "capitalize",
    marginTop: "4px",
  },
  routeLine: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    margin: "0 15px",
    position: "relative",
  },
  lineDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#94a3b8",
    borderRadius: "50%",
  },
  horizontalLine: {
    flex: 1,
    border: "none",
    borderTop: "2px dashed #cbd5e1",
    margin: 0,
  },
  busActionCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  priceTag: { fontSize: "24px", fontWeight: "800", color: "#1e2530" },
  seatTag: { fontSize: "13px", fontWeight: "600", marginBottom: "8px" },
  bookBtn: {
    backgroundColor: "#0a7d71",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
};
