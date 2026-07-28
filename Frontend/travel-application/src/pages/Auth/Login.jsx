import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsPerson,
  BsBusFront,
  BsShieldCheck,
  BsEnvelope,
  BsEye,
} from "react-icons/bs";

import { loginUser } from "../../services/authService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("CUSTOMER");

 const [loginData, setLoginData] = useState({
  email: "",
  passwordHash: "",
  role: "CUSTOMER", // Default selected role
});

  const theme = {
    CUSTOMER: {
      color: "#0E8A8A",
      icon: <BsPerson size={28} />,
    },
    PROVIDER: {
      color: "#FF7A29",
      icon: <BsBusFront size={28} />,
    },
    ADMIN: {
      color: "#7B4DDB",
      icon: <BsShieldCheck size={28} />,
    },
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const request = {
      email: loginData.email,
      passwordHash: loginData.passwordHash,
      role: role, // Selected role (CUSTOMER / PROVIDER / ADMIN)
    };

    const response = await loginUser(request);

    // Save login details
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("name", response.data.fullName);
    localStorage.setItem("userId", response.data.id);

    alert("Login Successful!");

    // Navigate based on actual role returned by backend
    switch (response.data.role) {
      case "ADMIN":
      case "ROLE_ADMIN":
        navigate("/Admin-Dashboard");
        break;

      case "PROVIDER":
      case "ROLE_PROVIDER":
        navigate("/provider-dashboard");
        break;

      case "CUSTOMER":
      case "ROLE_CUSTOMER":
      default:
        navigate("/home");
        break;
    }

  } catch (error) {
    alert(error.response?.data?.message || "Invalid Email or Password");
  }
};

  return (
    <div className="login-page">
      <div className="container">
        <div className="row shadow-lg auth-wrapper">

          {/* LEFT SIDE */}
          <div className="col-lg-5 left-section">
            <div className="overlay">
              <h2 className="logo-title">
                TravelHub
              </h2>

              <p className="tag-line">
                Explore. Book. Travel.
                <br />
                All in one place.
              </p>

              <div className="feature">
                <div className="feature-icon">
                  🚌
                </div>
                <div>
                  <h6>Book Buses & Packages</h6>
                  <p>Quick and easy booking experience</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  💰
                </div>
                <div>
                  <h6>Best Prices</h6>
                  <p>Get the best deals and offers</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  🛡️
                </div>
                <div>
                  <h6>Secure & Reliable</h6>
                  <p>Your safety is our priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-7 form-section">
            <div className="login-card">
              <h2>Sign In</h2>
              <p>Welcome back! Please sign in to continue</p>

              <label className="login-as">
                Login as
              </label>

              <div className="role-selection">
                <div
                  className={`role-card ${role === "CUSTOMER" ? "active" : ""}`}
                  style={{ borderColor: role === "CUSTOMER" ? theme.CUSTOMER.color : "#ddd" }}
                  onClick={() => setRole("CUSTOMER")}
                >
                  <div className="role-icon" style={{ background: theme.CUSTOMER.color }}>
                    {theme.CUSTOMER.icon}
                  </div>
                  <span>Customer</span>
                </div>

                <div
                  className={`role-card ${role === "PROVIDER" ? "active" : ""}`}
                  style={{ borderColor: role === "PROVIDER" ? theme.PROVIDER.color : "#ddd" }}
                  onClick={() => setRole("PROVIDER")}
                >
                  <div className="role-icon" style={{ background: theme.PROVIDER.color }}>
                    {theme.PROVIDER.icon}
                  </div>
                  <span>Bus Provider</span>
                </div>

                <div
                  className={`role-card ${role === "ADMIN" ? "active" : ""}`}
                  style={{ borderColor: role === "ADMIN" ? theme.ADMIN.color : "#ddd" }}
                  onClick={() => setRole("ADMIN")}
                >
                  <div className="role-icon" style={{ background: theme.ADMIN.color }}>
                    {theme.ADMIN.icon}
                  </div>
                  <span>Admin</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email</label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-group-text">
                      <BsEnvelope />
                    </span>
                  </div>
                </div>                
                
                <div className="mb-3">
                  <label>Password</label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="passwordHash"
                      className="form-control"
                      placeholder="Enter your password"
                      value={loginData.passwordHash}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-group-text">
                      <BsEye />
                    </span>
                  </div>
                </div>

                <div className="remember">
                  <div>
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </div>
                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="signin-btn"
                  style={{ background: theme[role].color }}
                >
                  Sign In
                </button>

                <div className="divider">
                  or continue with
                </div>

                <div className="social-icons">
                  <div>G</div>
                  <div>f</div>
                  <div></div>
                </div>

                <div className="signup-link">
                  Don't have an account?{" "}
                  <Link to="/register">
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}