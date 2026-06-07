import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    navigate("/"); 
  };

  return (
    <div className="travel-login-container">
      {/* Top Navbar */}
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

      {/* Main Split-Screen Card */}
      <div className="login-split-card">
        
        {/* Left Side: Login Form */}
        <div className="form-pane">
          <div className="pane-header">
            <h1>Welcome <span className="teal-text">Back</span></h1>
            <p>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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

            <div className="input-field-group">
              <label htmlFor="password">Password</label>
              <div className="field-inner-wrapper">
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
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

            <div className="form-actions-row">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-box"></span>
                Remember me
              </label>
              <Link to="/forgot-password" id="forgot-password-trigger">Forgot Password?</Link>
            </div>

            {/* Note: Kept strictly as type="submit" so it triggers handleSubmit safely */}
            <button type="submit" className="login-submit-btn">
              Sign In <span className="submit-arrow">→</span>
            </button>
          </form>

          <div className="text-divider">
            <span>or</span>
          </div>

          <div className="pane-footer">
            <p>Don't have an account? <Link to="/register" className="signup-trigger">Create Account</Link></p>
          </div>
        </div>

        {/* Right Side: Hero Image Banner */}
        <div className="image-pane">
          <div className="hero-quote-block">
            <span className="visual-quote">“</span>
            <h2>Collect Moments, <br />Not Things.</h2>
            <p>Let’s make your next trip unforgettable.</p>
          </div>

          {/* Bottom Frosted Glass Trust Badges */}
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

export default Login;