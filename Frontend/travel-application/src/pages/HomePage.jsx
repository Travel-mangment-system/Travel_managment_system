import React, { useState } from 'react';
import '../css/HomePage.css';
import heroImage from '../assets/FRONTEND.jpeg'; 

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('buses');

  const packages = [
    { id: 1, title: "Kerala Backwaters Escape", duration: "5 Days / 4 Nights", location: "Kerala", price: "18,999", tag: "Best Seller", tagClass: "tag-green", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Goa Beach Holiday", duration: "4 Days / 3 Nights", location: "Goa", price: "12,999", tag: "Popular", tagClass: "tag-orange", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Himachal Adventure", duration: "6 Days / 5 Nights", location: "Himachal", price: "22,999", tag: "New", tagClass: "tag-blue", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Rajasthan Heritage Tour", duration: "7 Days / 6 Nights", location: "Rajasthan", price: "24,999", tag: "", tagClass: "", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Andaman Getaway", duration: "5 Days / 4 Nights", location: "Andaman", price: "25,999", tag: "Recommended", tagClass: "tag-purple", img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Kashmir Scenic Beauty", duration: "5 Days / 4 Nights", location: "Kashmir", price: "20,999", tag: "", tagClass: "", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-subtitle">Your Journey, Our Priority</p>
          <h1 className="hero-title">Travel Smart. Travel Easy.</h1>
          <p className="hero-desc">Book buses, explore holiday packages and experience the world with us.</p>
        </div>

        {/* FLOATING SEARCH WIDGET */}
        <div className="search-widget">
          <div className="search-tabs">
            <button className={activeTab === 'buses' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('buses')}>
              <i className="fa-solid fa-bus"></i> Book Buses
            </button>
            
            {/* Wrapped in anchor tag for smooth scrolling */}
            <a href="#packages-destination" style={{ textDecoration: 'none' }}>
              <button className={activeTab === 'packages' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('packages')}>
                <i className="fa-solid fa-map"></i> Holiday Packages
              </button>
            </a>
            
            <button className={activeTab === 'offers' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('offers')}>
              <i className="fa-solid fa-tags"></i> Offers
            </button>
          </div>

          <div className="search-inputs">
            <div className="input-group">
              <label>From</label>
              <div className="input-field">
                <i className="fa-solid fa-location-dot"></i>
                <input type="text" placeholder="Enter source city" />
              </div>
            </div>

            <button className="swap-btn">
              <i className="fa-solid fa-right-left"></i>
            </button>

            <div className="input-group">
              <label>To</label>
              <div className="input-field">
                <i className="fa-solid fa-location-dot"></i>
                <input type="text" placeholder="Enter destination city" />
              </div>
            </div>

            <div className="input-group border-left">
              <label>Journey Date</label>
              <div className="input-field">
                <i className="fa-regular fa-calendar"></i>
                <input type="date" className="date-input" />
              </div>
            </div>

            <div className="input-group border-left">
              <label>Passengers</label>
              <div className="input-field">
                <i className="fa-regular fa-user"></i>
                <input type="number" min="1" max="10" defaultValue="1" className="passenger-input" placeholder="0" />
              </div>
            </div>

            <button className="search-btn">Search Buses</button>
          </div>

          <div className="trust-badges">
            <div className="badge"><i className="fa-solid fa-users text-teal"></i><div><h4>Trusted by Millions</h4><p>1M+ Happy Customers</p></div></div>
            <div className="badge"><i className="fa-solid fa-shield-halved text-teal"></i><div><h4>Best Price Guarantee</h4><p>Lowest Prices, Always</p></div></div>
            <div className="badge"><i className="fa-solid fa-globe text-teal"></i><div><h4>Wide Network</h4><p>5000+ Routes</p></div></div>
            <div className="badge"><i className="fa-solid fa-lock text-teal"></i><div><h4>Secure Booking</h4><p>Safe & Secure Payments</p></div></div>
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      {/* Added ID here to receive the smooth scroll jump */}
      <section className="packages-section" id="packages-destination">
        <div className="section-header">
          <div>
            <h2>Top Holiday Packages</h2>
            <p>Handpicked packages for your next unforgettable trip</p>
          </div>
          <a href="#" className="view-all">View All Packages <i className="fa-solid fa-chevron-right"></i></a>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <div className="card-img-container">
                {pkg.tag && <span className={`card-tag ${pkg.tagClass}`}>{pkg.tag}</span>}
                <img src={pkg.img} alt={pkg.title} />
              </div>
              <div className="card-content">
                <h3>{pkg.title}</h3>
                <div className="card-info">
                  <span><i className="fa-regular fa-calendar"></i> {pkg.duration}</span>
                  <span><i className="fa-solid fa-location-dot"></i> {pkg.location}</span>
                </div>
                <div className="card-bottom">
                  <div className="price-box">
                    <h4>₹{pkg.price}</h4>
                    <p>per person</p>
                  </div>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM FEATURES */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <i className="fa-regular fa-file-lines"></i>
            <div><h4>Easy Booking</h4><p>Quick and hassle-free booking</p></div>
          </div>
          <div className="divider"></div>
          <div className="feature-item">
            <i className="fa-solid fa-headset"></i>
            <div><h4>24/7 Customer Support</h4><p>We are here to help you anytime</p></div>
          </div>
          <div className="divider"></div>
          <div className="feature-item">
            <i className="fa-regular fa-calendar-xmark"></i>
            <div><h4>Flexible Cancellation</h4><p>Cancel or reschedule with ease</p></div>
          </div>
          <div className="divider"></div>
          <div className="feature-item">
            <i className="fa-regular fa-credit-card"></i>
            <div><h4>Secure Payments</h4><p>100% safe and secure payments</p></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;