import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate(); // Handles instant redirection smoothly
  
  // Component Form States
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Safety Validation Guard
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // Form submission processing payload simulation
    console.log("Account Registration Request:", { fullName, email, password });
    
    // 🛠️ FIXED: Removed the notification alert completely for instant silent redirection
    navigate("/login"); 
  };

  return (
    <div className="travel-register-container">
      {/* Top Application Navigation Strip */}
      <nav className="travel-navbar">
        <div className="nav-logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">Travel Management</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* Main Split-Screen Card Canvas */}
      <div className="register-split-card">
        
        {/* Left Module: Form Entry Deck */}
        <div className="form-pane">
          <div className="pane-header">
            <h1>Create <span className="teal-text">Account</span></h1>
            <p>Start your journey today!</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Input Component: Full Name */}
            <div className="input-field-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="field-inner-wrapper">
                <FiUser className="field-icon" />
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Component: Email Address */}
            <div className="input-field-group">
              <label htmlFor="email">Email Address</label>
              <div className="field-inner-wrapper">
                <FiMail className="field-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Component: Password Initializer */}
            <div className="input-field-group">
              <label htmlFor="password">Set Password</label>
              <div className="field-inner-wrapper">
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Input Component: Password Confirmation Checker */}
            <div className="input-field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="field-inner-wrapper">
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Control Execution Trigger */}
            <button type="submit" className="register-submit-btn">
              Sign Up <span className="submit-arrow">→</span>
            </button>
          </form>

          <div className="text-divider">
            <span>or</span>
          </div>

          <div className="pane-footer">
            <p>Already have an account? <Link to="/login" className="login-trigger">Log in</Link></p>
          </div>
        </div>

        {/* Right Module: Context Visual Graphic Split Panel */}
        <div className="image-pane">
          <div className="hero-quote-block">
            <span className="visual-quote">“</span>
            <h2>Your next adventure <br />begins with a single click.</h2>
            <p>Let’s make your next trip unforgettable.</p>
          </div>

          {/* Frosted Glass Horizon Metric Display Pods */}
          <div className="frosted-trust-bar">
            <div className="badge-item">
              <span className="badge-icon">🏷️</span>
              <div className="badge-meta">
                <h4>Best Prices</h4>
                <p>Guaranteed</p>
              </div>
            </div>
            <div className="badge-item segment-border">
              <span className="badge-icon">🛡️</span>
              <div className="badge-meta">
                <h4>Safe & Secure</h4>
                <p>Booking</p>
              </div>
            </div>
            <div className="badge-item segment-border">
              <span className="badge-icon">🎧</span>
              <div className="badge-meta">
                <h4>24/7 Customer</h4>
                <p>Support</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;