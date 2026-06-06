import React, { useState } from "react";
import Home from "./pages/home"; // Imports the clean travel dashboard you created
import "./App.css";

function App() {
  // Navigation active state to test your different routes/pages locally
  const [currentPage, setCurrentPage] = useState("home");

  // Simple conditional page rendering engine based on your project requirements
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "payment":
        return (
          <div style={styles.placeholderContainer}>
            <h2>💳 Payment Page Component</h2>
            <p>Integrate your payment gateway (Stripe/Razorpay) here.</p>
            <button
              style={styles.backBtn}
              onClick={() => setCurrentPage("home")}
            >
              Back to Home
            </button>
          </div>
        );
      case "confirmation":
        return (
          <div style={styles.placeholderContainer}>
            <h2>🎯 Bus Confirmation Page</h2>
            <p>This is where your successful checkout image mockup lives!</p>
            <button
              style={styles.backBtn}
              onClick={() => setCurrentPage("home")}
            >
              Back to Home
            </button>
          </div>
        );
      case "bookings":
        return (
          <div style={styles.placeholderContainer}>
            <h2>🧳 My Bookings & History Page</h2>
            <p>
              Display your past PNRs (like TRV849201X) and user itineraries
              here.
            </p>
            <button
              style={styles.backBtn}
              onClick={() => setCurrentPage("home")}
            >
              Back to Home
            </button>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* App Testing Menu Layout:
        Matches your exact design header bar for development routing toggles
      */}
      <div style={styles.testingMenu}>
        <span style={styles.menuLabel}>App Testing Menu:</span>
        <div style={styles.btnGroup}>
          <button
            style={{
              ...styles.testBtn,
              ...(currentPage === "home" ? styles.activeBtn : {}),
            }}
            onClick={() => setCurrentPage("home")}
          >
            Home / Search
          </button>
          <button
            style={{
              ...styles.testBtn,
              ...(currentPage === "payment" ? styles.activeBtn : {}),
            }}
            onClick={() => setCurrentPage("payment")}
          >
            Payment Page
          </button>
          <button
            style={{
              ...styles.testBtn,
              ...(currentPage === "confirmation" ? styles.activeBtn : {}),
            }}
            onClick={() => setCurrentPage("confirmation")}
          >
            Confirmation Page
          </button>
          <button
            style={{
              ...styles.testBtn,
              ...(currentPage === "bookings" ? styles.activeBtn : {}),
            }}
            onClick={() => setCurrentPage("bookings")}
          >
            My Bookings Page
          </button>
        </div>
      </div>

      {/* Render Active View Component */}
      {renderPage()}
    </>
  );
}

// --- App Navigation Component Styles ---
const styles = {
  testingMenu: {
    backgroundColor: "#111827", // Pitch dark tracking bar from top frame image
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderBottom: "2px solid #1e293b",
  },
  menuLabel: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "15px",
    fontFamily: "sans-serif",
  },
  btnGroup: {
    display: "flex",
    gap: "10px",
  },
  testBtn: {
    backgroundColor: "#374151", // Balanced neutral gray slate button layout
    color: "#9ca3af",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },
  activeBtn: {
    backgroundColor: "#0a7d71", // Matches active confirmation teal highlight state
    color: "#ffffff",
    fontWeight: "600",
  },
  placeholderContainer: {
    padding: "60px 20px",
    textAlign: "center",
    fontFamily: "sans-serif",
    minHeight: "80vh",
    backgroundColor: "#f8f9fa",
    color: "#1e2530",
  },
  backBtn: {
    marginTop: "20px",
    backgroundColor: "#1e2530",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default App;
