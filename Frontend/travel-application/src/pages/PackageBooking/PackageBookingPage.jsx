import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BsPersonPlus, 
  BsTrash, 
  BsGrid1X2,
  BsSuitcase,
  BsJournalCheck,
  BsBoxArrowRight,
  BsSearch,
  BsBell
} from "react-icons/bs";
import "./PackageBookingPage.css";

export default function PackageBookingPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const userName = localStorage.getItem("name") || "User";
  
  // State to manage dynamic travelers
  const [travelers, setTravelers] = useState([
    { fullName: "", age: "", gender: "MALE" }
  ]);

  const handleAddTraveler = () => {
    setTravelers([...travelers, { fullName: "", age: "", gender: "MALE" }]);
  };

  const handleRemoveTraveler = (index) => {
    if (travelers.length === 1) return; 
    const updatedTravelers = travelers.filter((_, i) => i !== index);
    setTravelers(updatedTravelers);
  };

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Get the logged-in user's ID from local storage
  const storedUserId = localStorage.getItem("userId");
  const storedPackageId = localStorage.getItem("packageId");
  const token = localStorage.getItem("token");

  if (!storedUserId || !storedPackageId || !token) {

    alert("Package information is missing. Please select a package again.");

    navigate("/home");

    setLoading(false);

    return;

}

    // 2. Construct the payload 
  const payload = {

    userId: parseInt(storedUserId),

    packageId: parseInt(storedPackageId),

    travlers: travelers.map(t => ({
        fullName: t.fullName,
        age: parseInt(t.age),
        gender: t.gender
    })),

    specialRequests: specialRequests

};

    console.log("Sending Payload to Spring Boot:", payload);

    try {
      const response = await fetch("http://localhost:8080/api/packageBooking/packages/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = {};
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Server returned non-JSON:", text);
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}. Check Spring Boot console.`);
      }

      // 3. Navigate to Summary Page with the payload and response data
      navigate(`/booking-summary/${data.bookingId}`, {
        state: {
          bookingId: data.bookingId,
          totalAmount: data.totalAmountPaid || 0,
          packageId: payload.packageId,
          travelers: payload.travlers,
          specialRequests: payload.specialRequests,
          userName: localStorage.getItem("name"),
          userEmail: localStorage.getItem("email") || "Not provided"
        }
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <a href="#home" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>
            <BsGrid1X2 size={20} /> Home
          </a>
          <a href="#bookings" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/my-package-bookings"); }}>
            <BsJournalCheck size={20} /> My Package Bookings
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#logout" className="nav-item logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
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
            <input type="text" placeholder="Search packages..." className="search-input" />
          </div>

          <div className="top-actions">
            <BsBell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
            <div className="profile-section">
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
                {userName}
              </span>
              <div className="avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="page-container">
          <div className="booking-form-wrapper">
            
            <div className="booking-header">
              <h2>Book Your Holiday Package</h2>
              <p>Please provide traveler details below to proceed.</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="booking-form">
              
              <div className="travelers-section">
                <div className="section-header">
                  <h3>Traveler Information</h3>
                  <button 
                    type="button" 
                    className="btn-add-traveler" 
                    onClick={handleAddTraveler}
                  >
                    <BsPersonPlus size={18} /> Add Traveler
                  </button>
                </div>

                {travelers.map((traveler, index) => (
                  <div key={index} className="traveler-card">
                    <div className="traveler-card-header">
                      <h4>Traveler {index + 1}</h4>
                      {travelers.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-remove"
                          onClick={() => handleRemoveTraveler(index)}
                        >
                          <BsTrash size={16} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="traveler-inputs">
                      <div className="input-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter full name"
                          value={traveler.fullName}
                          onChange={(e) => handleTravelerChange(index, "fullName", e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label>Age</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          placeholder="Age"
                          value={traveler.age}
                          onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label>Gender</label>
                        <select
                          value={traveler.gender}
                          onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="special-requests-section">
                <h3>Special Requests</h3>
                <textarea
                  placeholder="Any dietary requirements, accessibility needs, etc."
                  rows="4"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>

              <div className="booking-footer">
                <button type="submit" className="btn-submit-booking" disabled={loading}>
                  {loading ? "Processing..." : "Next"}
                </button>
              </div>

            </form>
          </div>
        </main>

      </div>
    </div>
  );
}