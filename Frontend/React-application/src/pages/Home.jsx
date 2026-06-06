import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import routing redirect engine

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      alert("Please fill out all search fields!");
      return;
    }

    // Redirects to /search page with input data structured safely inside URL params
    navigate(
      `/search?from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}&date=${encodeURIComponent(searchParams.date)}`,
    );
  };

  return (
    <>
      <main style={styles.heroSection}>
        <div style={styles.heroTextContainer}>
          <h1 style={styles.heroTitle}>Where are you traveling next?</h1>
          <p style={styles.heroSubtitle}>
            Find and book the safest intercity bus tickets instantly.
          </p>
        </div>

        <div style={styles.searchCard}>
          <form style={styles.searchForm} onSubmit={handleSearch}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>From</label>
              <input
                type="text"
                name="from"
                placeholder="E.g., Mumbai"
                value={searchParams.from}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>To</label>
              <input
                type="text"
                name="to"
                placeholder="E.g., Pune"
                value={searchParams.to}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Journey</label>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.searchSubmitBtn}>
              Search Buses
            </button>
          </form>
        </div>
      </main>

      <section style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <div style={styles.checkIcon}>✓</div>
          <h3 style={styles.featureTitle}>Instant Booking Confirmation</h3>
          <p style={styles.featureText}>
            Get secure PNR allocations and live ticket downloads right after
            payment.
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.checkIcon}>✓</div>
          <h3 style={styles.featureTitle}>Top Travel Operators</h3>
          <p style={styles.featureText}>
            Travel with trusted networks like VRL Travels, SRS, and national
            transport networks.
          </p>
        </div>
      </section>
    </>
  );
}

const styles = {
  heroSection: {
    background: "linear-gradient(180deg, #1e2530 0%, #2d3748 100%)",
    padding: "60px 20px 100px 20px",
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "sans-serif",
  },
  heroTextContainer: { marginBottom: "40px" },
  heroTitle: { fontSize: "36px", fontWeight: "700", margin: "0 0 12px 0" },
  heroSubtitle: { fontSize: "16px", color: "#cbd5e1", margin: 0 },
  searchCard: {
    backgroundColor: "#ffffff",
    maxWidth: "900px",
    margin: "0 auto -60px auto",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "24px",
    border: "1px solid #e2e8f0",
  },
  searchForm: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "flex-end",
  },
  inputGroup: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#1e2530",
    backgroundColor: "#f8fafc",
    outline: "none",
  },
  searchSubmitBtn: {
    backgroundColor: "#0a7d71",
    color: "#ffffff",
    border: "none",
    padding: "13px 28px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    height: "46px",
  },
  featuresSection: {
    maxWidth: "900px",
    margin: "120px auto 40px auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    padding: "0 20px",
  },
  featureCard: {
    backgroundColor: "#e6f7f4",
    border: "1px solid #c2f0e7",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center",
  },
  checkIcon: {
    backgroundColor: "#00cc99",
    color: "#ffffff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px auto",
    fontWeight: "bold",
  },
  featureTitle: { margin: "0 0 8px 0", fontSize: "18px", color: "#1e2530" },
  featureText: {
    margin: 0,
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.5",
  },
};
