import React, { useState } from "react";

export default function Home() {
  // --- State Management ---
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login', 'register', or null
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // --- Handlers ---
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
    alert(
      `Searching for buses from ${searchParams.from} to ${searchParams.to} on ${searchParams.date}`,
    );
    // Redirect logic to Search Result page goes here (e.g., useNavigate from react-router-dom)
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (showAuthModal === "register") {
      alert(`Successfully registered as ${authData.name}!`);
    } else {
      setIsLoggedIn(true);
      alert("Successfully logged in!");
    }
    setShowAuthModal(null);
    setAuthData({ email: "", password: "", name: "" });
  };

  return (
    <div style={styles.container}>
      {/* --- Dynamic Navbar (Matches top testing bar style) --- */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>TravelEase</div>
        <div style={styles.navLinks}>
          <button style={{ ...styles.navBtn, ...styles.activeNavBtn }}>
            Home
          </button>
          <button
            style={styles.navBtn}
            onClick={() => alert("Redirecting to My Bookings...")}
          >
            My Bookings
          </button>
          <button
            style={styles.navBtn}
            onClick={() => alert("Redirecting to Feedback...")}
          >
            Reviews
          </button>

          {isLoggedIn ? (
            <button style={styles.authBtn} onClick={() => setIsLoggedIn(false)}>
              Logout
            </button>
          ) : (
            <>
              <button
                style={styles.navBtn}
                onClick={() => setShowAuthModal("login")}
              >
                Login
              </button>
              <button
                style={styles.authBtn}
                onClick={() => setShowAuthModal("register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* --- Hero Section & Bus Search Engine --- */}
      <main style={styles.heroSection}>
        <div style={styles.heroTextContainer}>
          <h1 style={styles.heroTitle}>Where are you traveling next?</h1>
          <p style={styles.heroSubtitle}>
            Find and book the safest intercity bus tickets instantly.
          </p>
        </div>

        {/* Search Card */}
        <div style={styles.searchCard}>
          <form style={styles.searchForm} onSubmit={handleSearch}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>From</label>
              <input
                type="text"
                name="from"
                placeholder="E.g., Mumbai (BOM)"
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
                placeholder="E.g., Pune (PNQ)"
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

      {/* --- Features / Trust Badges (Matches the clean ticket UI look) --- */}
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

      {/* --- Authentic Modular Authentication Modal --- */}
      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h2 style={styles.modalTitle}>
              {showAuthModal === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <form onSubmit={handleAuthSubmit} style={styles.modalForm}>
              {showAuthModal === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={authData.name}
                  onChange={(e) =>
                    setAuthData({ ...authData, name: e.target.value })
                  }
                  style={styles.modalInput}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                required
                value={authData.email}
                onChange={(e) =>
                  setAuthData({ ...authData, email: e.target.value })
                }
                style={styles.modalInput}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                style={styles.modalInput}
              />
              <button type="submit" style={styles.modalSubmitBtn}>
                {showAuthModal === "login" ? "Login" : "Register"}
              </button>
            </form>
            <button
              style={styles.modalCloseBtn}
              onClick={() => setShowAuthModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Verified Color Palette & Inline Styles ---
const styles = {
  container: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    margin: 0,
    color: "#1a2b49", // Core deep navy tone from image typography
  },
  navbar: {
    backgroundColor: "#1e2530", // Deep app navbar background color
    padding: "12px 64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  navLogo: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  navLinks: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: "#2d3748", // Unselected pill buttons
    color: "#d1d5db",
    border: "none",
    padding: "8px 18px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  activeNavBtn: {
    backgroundColor: "#0a7d71", // Selection teal tone from confirmation button
    color: "#ffffff",
  },
  authBtn: {
    backgroundColor: "#ffffff",
    color: "#1e2530",
    border: "none",
    padding: "8px 18px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  heroSection: {
    background: "linear-gradient(180deg, #1e2530 0%, #2d3748 100%)",
    padding: "60px 20px 100px 20px",
    textAlign: "center",
    color: "#ffffff",
  },
  heroTextContainer: {
    marginBottom: "40px",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 12px 0",
  },
  heroSubtitle: {
    fontSize: "16px",
    color: "#cbd5e1",
    margin: 0,
  },
  searchCard: {
    backgroundColor: "#ffffff",
    maxWidth: "900px",
    margin: "0 auto -60px auto", // Pulls card downward overlapping the section
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
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#1e2530",
    outline: "none",
    backgroundColor: "#f8fafc",
  },
  searchSubmitBtn: {
    backgroundColor: "#0a7d71", // Confirmation Teal
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
    backgroundColor: "#e6f7f4", // Very light teal background block from image top card
    border: "1px solid #c2f0e7",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center",
  },
  checkIcon: {
    backgroundColor: "#00cc99", // True Green indicator
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
  featureTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    color: "#1e2530",
  },
  featureText: {
    margin: 0,
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.5",
  },
  /* Modal System Styles */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  modalTitle: {
    margin: "0 0 20px 0",
    color: "#1e2530",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  modalInput: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "14px",
  },
  modalSubmitBtn: {
    backgroundColor: "#0a7d71",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    marginTop: "16px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
