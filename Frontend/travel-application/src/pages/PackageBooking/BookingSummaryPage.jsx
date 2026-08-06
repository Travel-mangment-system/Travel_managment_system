import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BsGrid1X2,
  BsSuitcase,
  BsJournalCheck,
  BsBoxArrowRight,
  BsSearch,
  BsBell,
  BsCheckCircle,
  BsPerson,
  BsCashCoin,
} from "react-icons/bs";
import "./PackageBookingPage.css";
import "./BookingSummaryPage.css";

// Helper function to dynamically load the Razorpay SDK script
const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();

  const [isPaying, setIsPaying] = useState(false); // New loading state for the payment button

  const summaryData = location.state;
  const userName = localStorage.getItem("name") || "User";

  if (!summaryData) {
    return (
      <div className="manage-packages-layout">
        <div
          className="main-content"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          <h2>No booking data found.</h2>
          <p style={{ marginBottom: "20px", color: "#64748b" }}>
            Please start your booking from the packages page.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="btn-submit-booking"
            style={{ width: "auto", padding: "10px 20px" }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ==========================================
  // RAZORPAY PAYMENT INTEGRATION
  // ==========================================
  const handleProceedToPayment = async () => {
    setIsPaying(true);
    const token = localStorage.getItem("token");

    // 1. Load the SDK
    const isSdkLoaded = await loadRazorpaySDK();
    if (!isSdkLoaded) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection.",
      );
      setIsPaying(false);
      return;
    }

    try {
      // 2. Request Order ID from Spring Boot Backend
      const orderPayload = {
        bookingId: summaryData.bookingId,
        bookingType: "PACKAGE", // Specify PACKAGE as defined in your backend logic
      };

      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        },
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to initialize payment on the server.");
      }

      const orderData = await orderResponse.json();

      /// 3. Configure Razorpay Options
      const options = {
        key: "rzp_test_T8KumDMe0OjqSN", // Updated with your exact Razorpay Key ID
        amount: orderData.amount * 100, // Razorpay expects amount in paise
        currency: orderData.currency || "INR",
        name: "TravelHub",
        description: `Payment for Package Booking #${summaryData.bookingId}`,
        order_id: orderData.razorpayOrderId,
        // 4. Handle Successful Payment Callback
        handler: async function (response) {
          try {
            // Send the signature details back to Spring Boot for verification
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(verifyPayload),
              },
            );

            if (verifyResponse.ok) {
              // Change the navigate function to go to the new page and pass the data!
              navigate("/booking-confirmed", {
                state: {
                  ...summaryData, // Passes along package name, travelers, bookingId, etc.
                  paymentId: response.razorpay_payment_id, // Adds the new payment ID
                },
              });
            } else {
              alert("Payment verification failed at the server.");
            }
          } catch (verifyError) {
            console.error("Verification Error:", verifyError);
            alert("An error occurred while verifying the payment.");
          }
        },
        prefill: {
          name: summaryData.userName,
          email: summaryData.userEmail || "",
        },
        theme: {
          color: "#0E8A8A", // Matches your TravelHub CSS branding
        },
      };

      // 5. Open Razorpay Checkout Window
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(error.message);
    } finally {
      setIsPaying(false);
    }
  };

  const travelersList = summaryData.travelers || [];

  return (
    <div className="manage-packages-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <BsSuitcase size={24} className="brand-icon" />
          <span className="brand-text">TravelHub</span>
        </div>
        <div className="sidebar-title">Menu</div>
        <nav className="sidebar-nav">
          <a
            href="#home"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/home");
            }}
          >
            <BsGrid1X2 size={20} /> Home
          </a>
          <a
            href="#bookings"
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate("/my-package-bookings");
            }}
          >
            <BsJournalCheck size={20} /> My Package Bookings
          </a>
        </nav>
        <div className="sidebar-footer">
          <a
            href="#logout"
            className="nav-item logout"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <BsBoxArrowRight size={20} /> Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP NAVBAR */}
        <header className="top-navbar">
          <div className="search-bar">
            <BsSearch size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
          <div className="top-actions">
            <BsBell size={20} color="#64748b" style={{ cursor: "pointer" }} />
            <div className="profile-section">
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#334155",
                }}
              >
                {userName}
              </span>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        {/* SUMMARY CONTENT */}
        <main className="page-container">
          <div className="summary-wrapper">
            <div className="summary-header">
              <BsCheckCircle size={40} color="#0E8A8A" />
              <h2>Booking Draft Saved!</h2>
              <p>Please review your details before proceeding to payment.</p>
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <h3>
                  <BsSuitcase className="icon-align" /> Booking Details
                </h3>
                <div className="detail-row">
                  <span>Booking Reference:</span>
                  <strong>
                    #{summaryData.bookingId || bookingId || "N/A"}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Package ID:</span>
                  <strong>{summaryData.packageId || "N/A"}</strong>
                </div>
                <div className="detail-row">
                  <span>Booked By:</span>
                  <strong>{summaryData.userName || userName}</strong>
                </div>
              </div>

              <div className="summary-card">
                <h3>
                  <BsPerson className="icon-align" /> Travelers (
                  {travelersList.length})
                </h3>
                <div className="traveler-list">
                  {travelersList.map((t, index) => (
                    <div key={index} className="traveler-item">
                      <div className="traveler-name">
                        {t.fullName || "Unknown Name"}
                      </div>
                      <div className="traveler-meta">
                        {t.age || "?"} yrs • {t.gender || "N/A"}
                      </div>
                    </div>
                  ))}
                  {travelersList.length === 0 && (
                    <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      No traveler details provided.
                    </div>
                  )}
                </div>
              </div>

              {summaryData.specialRequests && (
                <div className="summary-card full-width">
                  <h3>Special Requests</h3>
                  <p className="special-req-text">
                    {summaryData.specialRequests}
                  </p>
                </div>
              )}

              <div className="summary-card highlight-card full-width">
                <h3>
                  <BsCashCoin className="icon-align" /> Payment Summary
                </h3>
                <div className="detail-row total-row">
                  <span>Total Amount Due:</span>
                  <strong className="amount">
                    ₹ {summaryData.totalAmount || 0}
                  </strong>
                </div>
              </div>
            </div>

            <div className="booking-footer" style={{ marginTop: "2rem" }}>
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate(-1)}
                disabled={isPaying}
              >
                Back to Edit
              </button>

              {/* Payment Button with Loading State */}
              <button
                type="button"
                className="btn-submit-booking"
                onClick={handleProceedToPayment}
                disabled={isPaying}
              >
                {isPaying ? (
                  "Processing..."
                ) : (
                  <>
                    <BsCheckCircle size={18} /> Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
