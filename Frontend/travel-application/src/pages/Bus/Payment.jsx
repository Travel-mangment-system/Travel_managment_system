import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Home, Search, Ticket, Wallet, Heart, Headphones, Bell, User, Settings, LogOut, Bus as BusIcon
} from "lucide-react";
import api from "../../services/api";

// Import your existing stylesheets to maintain the layout and stepper styling
import "../Provider/Dashboard.css"; 
import "./PassengerDetails.css";    

const BusPaymentPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state passed from PassengerDetails
  const { bookingResponse, totalPrice, busDetails, boarding, dropping, selectedSeats } = location.state || {};
  
  const userName = localStorage.getItem("userName") || "Customer";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // 1. Call Spring Boot to create Razorpay Order
      // Using bookingResponse.id or bookingResponse.bookingId depending on your backend entity
      const orderPayload = {
        bookingId: bookingResponse?.id || bookingResponse?.bookingId, 
        bookingType: "BUS"
      };

      const orderRes = await api.post("/api/v1/payments/create-order", orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { razorpayOrderId, amount, currency } = orderRes.data;

      // 2. Configure Razorpay Popup
      const options = {
        key: "rzp_test_T8KumDMe0OjqSN", // Your Razorpay Sandbox Key
        amount: amount,
        currency: currency,
        name: "TravelHub Bus Services",
        description: `Booking for ${busDetails?.busName || 'Bus'}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature with Spring Boot
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            const verifyRes = await api.post("/api/v1/payments/verify", verifyPayload, {
              headers: { Authorization: `Bearer ${token}` }
            });

           if (verifyRes.status === 200) {
            // 1. Grab the busId from your existing state (adjust the path if your state structure is slightly different)
            const busId = location.state?.busId || location.state?.bus?.id;

            // 2. Redirect to the new dynamic route
            navigate(`/buses/${busId}/confirmation`, {
              state: {
                ...location.state,
                paymentId: response.razorpay_payment_id,
                bookingId: bookingResponse?.id || bookingResponse?.bookingId
              }
            });
          }
          } catch (verifyErr) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userName,
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("mobile") || ""
        },
        theme: {
          color: "#ea580c" // Matches your brand orange
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
      });

      rzp1.open();

    } catch (err) {
      console.error(err);
      setError("Could not initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingResponse) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h3>Booking session expired or invalid.</h3>
        <button onClick={() => navigate("/buses")} style={{ padding: "10px 24px", backgroundColor: "#ea580c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="provider-dashboard-layout" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* SIDEBAR (Reused from PassengerDetails for consistency) */}
      <aside className="provider-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-box" style={{ backgroundColor: "#ea580c" }}>
            <BusIcon size={22} color="#FFFFFF" />
          </div>
          <div className="logo-text">
            <h2>TravelHub</h2>
            <p style={{ opacity: 0.8 }}>Customer Panel</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/home")}><Home size={20} /> Dashboard</button>
          <button className="nav-item active" onClick={() => navigate("/buses")}><Search size={20} /> Search Buses</button>
        </nav>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* TOPBAR */}
        <header style={{ height: "70px", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 32px" }}>
          <strong style={{ fontSize: "14px", color: "#333" }}>{userName}</strong>
        </header>

        {/* PAYMENT CONTENT */}
        <div style={{ padding: "32px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
          
          <div className="stepper-wrapper" style={{ margin: "0 auto 40px" }}>
            <div className="stepper-line"></div>
            <div className="step active completed"><div className="step-circle">✓</div><span className="step-label">Select Seats</span></div>
            <div className="step active completed"><div className="step-circle">✓</div><span className="step-label">Passenger Details</span></div>
            <div className="step active current"><div className="step-circle"><div className="inner-dot"></div></div><span className="step-label">Payment</span></div>
          </div>

          <h2 style={{ marginBottom: "24px", fontSize: "24px", color: "#111" }}>Complete Your Payment</h2>

          {error && (
            <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
            
            {/* Left: Summary Box */}
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
               <h3 style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>Booking Summary</h3>
               
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#64748b" }}>Bus</span>
                  <strong style={{ color: "#0f172a" }}>{busDetails?.busName} ({busDetails?.busType})</strong>
               </div>
               
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#64748b" }}>Route</span>
                  <strong style={{ color: "#0f172a" }}>{boarding?.stopName} → {dropping?.stopName}</strong>
               </div>

               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#64748b" }}>Seats ({selectedSeats?.length})</span>
                  <strong style={{ color: "#0f172a" }}>{selectedSeats?.map(s => s.seatNumber || s.number).join(", ")}</strong>
               </div>

               <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #cbd5e1" }}>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>Total Amount to Pay</span>
                  <span style={{ fontSize: "20px", fontWeight: "700", color: "#ea580c" }}>₹{totalPrice}</span>
               </div>
            </div>

            {/* Right: Payment Action */}
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" style={{ width: "150px", marginBottom: "24px" }} />
                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>
                  You will be redirected to Razorpay's secure payment gateway to complete your transaction.
                </p>
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  style={{ width: "100%", padding: "14px", backgroundColor: "#0f766e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Processing..." : `Pay ₹${totalPrice} Securely`}
                </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default BusPaymentPage;