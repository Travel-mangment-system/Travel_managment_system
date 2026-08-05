import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Bell,
  ChevronDown,
  CheckCircle,
  HeadphonesIcon,
  Lock,
  ArrowLeft,
} from "lucide-react";
import "./ProviderSetup.css";

const ProviderSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract userId from previous signup step. Fallback to a placeholder if tested directly.
  const userId = location.state?.userId || "1747912345678";

  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      userId: parseInt(userId, 10),
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/login"); // Redirect on success
      } else {
        alert(
          "Failed to complete provider registration. Please check your details.",
        );
      }
    } catch (error) {
      console.error("Error registering provider:", error);
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="provider-setup-page">
      {/* Mock Navbar */}
      <nav className="provider-navbar">
        <Bell size={20} color="#666" style={{ cursor: "pointer" }} />
        <div className="nav-profile">
          <div className="avatar">P</div>
          <span>Provider Account</span>
          <ChevronDown size={16} color="#666" />
        </div>
      </nav>

      {/* Success Header */}
      <div className="success-header">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={32} />
        </div>
        <h1>Account Created Successfully!</h1>
        <p>
          Your provider account has been created.
          <br />
          Please complete your provider registration to start using TravelHub.
        </p>
      </div>

      <div className="setup-container">
        {/* Left Column: Form */}
        <div className="card">
          <h2>Complete Your Provider Registration</h2>
          <p>
            Please provide your company details to complete the registration.
          </p>

          <form onSubmit={handleProviderSubmit}>
            <div className="form-group">
              <label>
                Company Name <span className="asterisk">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                GST Number <span className="asterisk">*</span>
              </label>
              <input
                type="text"
                name="gstNumber"
                className="form-input"
                placeholder="Enter GST number"
                value={formData.gstNumber}
                onChange={handleChange}
                required
              />
              <span className="helper-text">
                Enter valid GST number (e.g. 27ABCDE1234F1Z5)
              </span>
            </div>

            <div className="form-group">
              <label>
                Address <span className="asterisk">*</span>
              </label>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your complete address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <span className="helper-text">
                Office address or registered address
              </span>
            </div>

            <div className="form-group">
              <label>User ID (Auto filled)</label>
              <input
                type="text"
                className="form-input"
                value={`USR${userId}`} // Makes it look like the mockup
                disabled
              />
              <span className="helper-text">
                This is your registered user ID
              </span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Info Card */}
        <div className="card info-card">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
            alt="TravelHub Bus"
            className="bus-image"
            style={{ objectFit: "cover", height: "180px" }}
          />
          <h3>Welcome to TravelHub!</h3>
          <p>Complete your provider profile to:</p>

          <ul className="feature-list">
            <li>
              <CheckCircle size={18} className="check-icon" /> Add and manage
              your buses
            </li>
            <li>
              <CheckCircle size={18} className="check-icon" /> Create routes and
              schedules
            </li>
            <li>
              <CheckCircle size={18} className="check-icon" /> Receive bookings
              from customers
            </li>
            <li>
              <CheckCircle size={18} className="check-icon" /> Track earnings
              and reports
            </li>
          </ul>

          <div className="support-box">
            <div className="support-header">
              <HeadphonesIcon size={20} />
              <span>Need Help?</span>
            </div>
            <p>Our support team is here to assist you.</p>
            <button className="btn-support">Contact Support</button>
          </div>
        </div>
      </div>

      {/* Footer Security Banner */}
      <div className="security-banner">
        <div className="lock-icon-wrapper">
          <Lock size={24} />
        </div>
        <div className="security-text">
          <h4>Your information is secure with us.</h4>
          <p>We use industry-standard security to protect your data.</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderSetup;
