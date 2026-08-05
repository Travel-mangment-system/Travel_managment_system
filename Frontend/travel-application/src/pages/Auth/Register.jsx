import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../../services/authService"; // Uncomment when ready

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "MALE",
    passwordHash: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordHash !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Don't send confirmPassword to the backend
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        passwordHash: formData.passwordHash,
        role: formData.role,
      };

      const response = await registerUser(userData);

      console.log("Registration Response:", response.data);
      alert("Registration Successful");

      // =================================================================
      // 👇 NEW LOGIC: Redirect based on role
      // =================================================================
      if (formData.role === "PROVIDER") {
        // Extract the new user's ID from the backend response.
        // NOTE: Adjust 'response.data.id' to match exactly what your Spring Boot backend returns (e.g., response.data.userId)
        const generatedUserId = response.data.id || response.data.userId;

        // Navigate to provider setup and pass the user ID invisibly
        navigate("/provider-setup", { state: { userId: generatedUserId } });
      } else {
        // Customers and Admins go straight to login
        navigate("/login");
      }
      // =================================================================
    } catch (error) {
      console.error(error);
      console.error("Registration Error:", error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="register-page auth-bg">
      <div className="container auth-container">
        <div className="row auth-wrapper">
          {/* LEFT PANEL */}
          <div className="col-lg-5 p-0 d-none d-lg-block">
            <div className="left-panel">
              <div className="overlay">
                <h1>TravelHub</h1>
                <p>
                  Join thousands of travellers and service providers around the
                  world.
                </p>
                <div className="features-list">
                  <div className="feature">✈ Easy Booking</div>
                  <div className="feature">🚌 Grow Your Business</div>
                  <div className="feature">✔ Trusted Platform</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-7 p-0">
            <div className="card h-100">
              <div className="card-body">
                <h2>Create Account</h2>
                <p className="subtitle">
                  Join TravelHub and start your journey.
                </p>

                {/* ROLE BUTTONS */}
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`btn ${role === "CUSTOMER" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => {
                      setRole("CUSTOMER");
                      setFormData({ ...formData, role: "CUSTOMER" });
                    }}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === "PROVIDER" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => {
                      setRole("PROVIDER");
                      setFormData({ ...formData, role: "PROVIDER" });
                    }}
                  >
                    Provider
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === "ADMIN" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => {
                      setRole("ADMIN");
                      setFormData({ ...formData, role: "ADMIN" });
                    }}
                  >
                    Admin
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      placeholder="Enter Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        placeholder="Enter Mobile"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="passwordHash"
                        placeholder="Password"
                        value={formData.passwordHash}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* GENDER + TERMS */}
                  <div className="bottom-row">
                    <div className="gender-section">
                      <label className="gender-title">Gender</label>
                      <div className="gender-options">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="genderMale"
                            value="MALE"
                            checked={formData.gender === "MALE"}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="genderMale"
                          >
                            Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="genderFemale"
                            value="FEMALE"
                            checked={formData.gender === "FEMALE"}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="genderFemale"
                          >
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-check terms-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label
                        className="form-check-label fw-bold"
                        htmlFor="terms"
                      >
                        I agree to Terms
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-register"
                  >
                    Create Account
                  </button>
                </form>

                <div className="login-link">
                  Already have an account?
                  <Link to="/login" className="ms-2">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
