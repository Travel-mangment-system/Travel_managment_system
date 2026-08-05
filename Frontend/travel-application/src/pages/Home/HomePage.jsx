// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import heroImage from "../../assets/images/home-banner.jpeg";
// import "./HomePage.css";

// import HomeNavbar from "../../components/Layout/HomeNavbar";
// import PackageCard from "../../components/Packages/PackageCard";
// import { getCustomerHomePackages } from "../../services/packageService";
// import {
//   FaBus,
//   FaUmbrellaBeach,
//   FaTags,
//   FaExchangeAlt,
//   FaUserFriends,
//   FaShieldAlt,
//   FaHeadset,
//   FaLock,
//   FaCalendarCheck,
//   FaMoneyCheckAlt,
// } from "react-icons/fa";

// const HomePage = () => {
//   const navigate = useNavigate();

//   const [packages, setPackages] = useState([]);
//   const [activeTab, setActiveTab] = useState("buses");

//   const [searchData, setSearchData] = useState({
//     source: "",
//     destination: "",
//     journeyDate: "",
//     passengers: "1 Passenger",
//   });

//   const packageSectionRef = useRef(null);

//   useEffect(() => {
//     loadPackages();
//   }, []);

//   const loadPackages = async () => {
//     try {
//       const response = await getCustomerHomePackages();
//       const packageList = Array.isArray(response) ? response : response.data;
//       setPackages(Array.isArray(packageList) ? packageList : []);
//     } catch (error) {
//       console.error("Failed to load packages:", error);
//       setPackages([]);
//     }
//   };

//   const handleChange = (e) => {
//     setSearchData({
//       ...searchData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleBusSearch = () => {
//     if (
//       !searchData.source.trim() ||
//       !searchData.destination.trim() ||
//       !searchData.journeyDate
//     ) {
//       alert(
//         "Please fill in Source City, Destination City, and Journey Date to search for buses.",
//       );
//       return;
//     }

//     navigate(
//       `/buses?source=${encodeURIComponent(searchData.source)}&destination=${encodeURIComponent(searchData.destination)}&date=${encodeURIComponent(searchData.journeyDate)}`,
//       {
//         state: searchData,
//       },
//     );
//   };

//   const handleHolidayPackagesTab = () => {
//     setActiveTab("packages");
//     packageSectionRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         overflowY: "auto",
//         width: "100%",
//         position: "relative",
//       }}
//     >
//       <HomeNavbar />

//       <div className="home-page">
//         {/* Hero Section */}
//         <section
//           className="hero-section"
//           style={{
//             backgroundImage: `url(${heroImage})`,
//           }}
//         >
//           <div className="overlay"></div>

//           <div className="hero-content">
//             <h4>Your Journey, Our Priority</h4>
//             <h1>
//               Travel Smart.
//               <br />
//               Travel Easy.
//             </h1>
//             <p>
//               Book buses, explore holiday packages and experience the world with
//               us.
//             </p>
//           </div>

//           {/* Search & Booking Card */}
//           <div className="search-card">
//             <div className="search-tabs">
//               <button
//                 className={activeTab === "buses" ? "active-tab" : ""}
//                 onClick={() => setActiveTab("buses")}
//               >
//                 <FaBus style={{ marginRight: "8px" }} /> Book Buses
//               </button>

//               <button
//                 className={activeTab === "packages" ? "active-tab" : ""}
//                 onClick={handleHolidayPackagesTab}
//               >
//                 <FaUmbrellaBeach style={{ marginRight: "8px" }} /> Holiday
//                 Packages
//               </button>

//               <button
//                 className={activeTab === "offers" ? "active-tab" : ""}
//                 onClick={() => setActiveTab("offers")}
//               >
//                 <FaTags style={{ marginRight: "8px" }} /> Offers
//               </button>
//             </div>

//             {activeTab === "buses" && (
//               <div className="search-form">
//                 <div className="input-field-group">
//                   <label>From</label>
//                   <input
//                     type="text"
//                     name="source"
//                     placeholder="Enter source city"
//                     value={searchData.source}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="swap-icon-container">
//                   <FaExchangeAlt className="swap-icon" />
//                 </div>

//                 <div className="input-field-group">
//                   <label>To</label>
//                   <input
//                     type="text"
//                     name="destination"
//                     placeholder="Enter destination city"
//                     value={searchData.destination}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="input-field-group">
//                   <label>Journey Date</label>
//                   <input
//                     type="date"
//                     name="journeyDate"
//                     value={searchData.journeyDate}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="input-field-group">
//                   <label>Passengers</label>
//                   <select
//                     name="passengers"
//                     value={searchData.passengers}
//                     onChange={handleChange}
//                   >
//                     <option value="1 Passenger">1 Passenger</option>
//                     <option value="2 Passengers">2 Passengers</option>
//                     <option value="3+ Passengers">3+ Passengers</option>
//                   </select>
//                 </div>

//                 <button className="search-btn" onClick={handleBusSearch}>
//                   Search Buses
//                 </button>
//               </div>
//             )}

//             {activeTab === "packages" && (
//               <div className="tab-placeholder-content">
//                 <p>
//                   Scroll down to browse our handpicked holiday packages below!
//                 </p>
//               </div>
//             )}

//             {activeTab === "offers" && (
//               <div className="tab-placeholder-content">
//                 <p>No active promotional offers right now. Check back soon!</p>
//               </div>
//             )}

//             {/* Search Card Trust Badges */}
//             <div className="search-card-features">
//               <div className="feature-item">
//                 <FaUserFriends className="feature-badge-icon" />
//                 <div>
//                   <strong>Trusted by Millions</strong>
//                   <span>1M+ Happy Customers</span>
//                 </div>
//               </div>
//               <div className="feature-item">
//                 <FaShieldAlt className="feature-badge-icon" />
//                 <div>
//                   <strong>Best Price Guarantee</strong>
//                   <span>Lowest Prices, Always</span>
//                 </div>
//               </div>
//               <div className="feature-item">
//                 <FaBus className="feature-badge-icon" />
//                 <div>
//                   <strong>Wide Network</strong>
//                   <span>5000+ Routes</span>
//                 </div>
//               </div>
//               <div className="feature-item">
//                 <FaLock className="feature-badge-icon" />
//                 <div>
//                   <strong>Secure Booking</strong>
//                   <span>Safe & Secure Payments</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular Packages Section using your working PackageCard component */}
//         <section className="package-section" ref={packageSectionRef}>
//           <div className="section-header">
//             <div>
//               <h2>Top Holiday Packages</h2>
//               <p>Handpicked packages for your next unforgettable trip</p>
//             </div>
//             <span
//               className="view-all-link"
//               onClick={() => navigate("/packages")}
//             >
//               View All Packages &gt;
//             </span>
//           </div>

//           <div className="package-grid">
//             {packages.map((pkg) => (
//               <PackageCard key={pkg.packageId} pkg={pkg} />
//             ))}
//           </div>
//         </section>

//         {/* Bottom Trust Feature Footer Bar */}
//         <section className="bottom-features-bar">
//           <div className="bottom-feature-card">
//             <FaCalendarCheck className="bottom-feat-icon" />
//             <div>
//               <h4>Easy Booking</h4>
//               <p>Quick and hasslefree booking</p>
//             </div>
//           </div>
//           <div className="bottom-feature-card">
//             <FaHeadset className="bottom-feat-icon" />
//             <div>
//               <h4>24/7 Customer Support</h4>
//               <p>We are here to help you anytime</p>
//             </div>
//           </div>
//           <div className="bottom-feature-card">
//             <FaExchangeAlt className="bottom-feat-icon" />
//             <div>
//               <h4>Flexible Cancellation</h4>
//               <p>Cancel or reschedule with ease</p>
//             </div>
//           </div>
//           <div className="bottom-feature-card">
//             <FaMoneyCheckAlt className="bottom-feat-icon" />
//             <div>
//               <h4>Secure Payments</h4>
//               <p>100% safe and secure payments</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/home-banner.jpeg";
import "./HomePage.css";

import HomeNavbar from "../../components/Layout/HomeNavbar";
import PackageCard from "../../components/Packages/PackageCard";
import Chatbot from "../../components/Chatbot"; // 🤖 Imported Chatbot Component
import { getCustomerHomePackages } from "../../services/packageService";
import {
  FaBus,
  FaUmbrellaBeach,
  FaTags,
  FaExchangeAlt,
  FaUserFriends,
  FaShieldAlt,
  FaHeadset,
  FaLock,
  FaCalendarCheck,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("buses");

  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    journeyDate: "",
    passengers: "1 Passenger",
  });

  const packageSectionRef = useRef(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await getCustomerHomePackages();
      const packageList = Array.isArray(response) ? response : response.data;
      setPackages(Array.isArray(packageList) ? packageList : []);
    } catch (error) {
      console.error("Failed to load packages:", error);
      setPackages([]);
    }
  };

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBusSearch = () => {
    if (
      !searchData.source.trim() ||
      !searchData.destination.trim() ||
      !searchData.journeyDate
    ) {
      alert(
        "Please fill in Source City, Destination City, and Journey Date to search for buses.",
      );
      return;
    }

    navigate(
      `/buses?source=${encodeURIComponent(searchData.source)}&destination=${encodeURIComponent(searchData.destination)}&date=${encodeURIComponent(searchData.journeyDate)}`,
      {
        state: searchData,
      },
    );
  };

  const handleHolidayPackagesTab = () => {
    setActiveTab("packages");
    packageSectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        width: "100%",
        position: "relative",
      }}
    >
      <HomeNavbar />

      <div className="home-page">
        {/* Hero Section */}
        <section
          className="hero-section"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="overlay"></div>

          <div className="hero-content">
            <h4>Your Journey, Our Priority</h4>
            <h1>
              Travel Smart.
              <br />
              Travel Easy.
            </h1>
            <p>
              Book buses, explore holiday packages and experience the world with
              us.
            </p>
          </div>

          {/* Search & Booking Card */}
          <div className="search-card">
            <div className="search-tabs">
              <button
                className={activeTab === "buses" ? "active-tab" : ""}
                onClick={() => setActiveTab("buses")}
              >
                <FaBus style={{ marginRight: "8px" }} /> Book Buses
              </button>

              <button
                className={activeTab === "packages" ? "active-tab" : ""}
                onClick={handleHolidayPackagesTab}
              >
                <FaUmbrellaBeach style={{ marginRight: "8px" }} /> Holiday
                Packages
              </button>

              <button
                className={activeTab === "offers" ? "active-tab" : ""}
                onClick={() => setActiveTab("offers")}
              >
                <FaTags style={{ marginRight: "8px" }} /> Offers
              </button>
            </div>

            {activeTab === "buses" && (
              <div className="search-form">
                <div className="input-field-group">
                  <label>From</label>
                  <input
                    type="text"
                    name="source"
                    placeholder="Enter source city"
                    value={searchData.source}
                    onChange={handleChange}
                  />
                </div>

                <div className="swap-icon-container">
                  <FaExchangeAlt className="swap-icon" />
                </div>

                <div className="input-field-group">
                  <label>To</label>
                  <input
                    type="text"
                    name="destination"
                    placeholder="Enter destination city"
                    value={searchData.destination}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-group">
                  <label>Journey Date</label>
                  <input
                    type="date"
                    name="journeyDate"
                    value={searchData.journeyDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-group">
                  <label>Passengers</label>
                  <select
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleChange}
                  >
                    <option value="1 Passenger">1 Passenger</option>
                    <option value="2 Passengers">2 Passengers</option>
                    <option value="3+ Passengers">3+ Passengers</option>
                  </select>
                </div>

                <button className="search-btn" onClick={handleBusSearch}>
                  Search Buses
                </button>
              </div>
            )}

            {activeTab === "packages" && (
              <div className="tab-placeholder-content">
                <p>
                  Scroll down to browse our handpicked holiday packages below!
                </p>
              </div>
            )}

            {activeTab === "offers" && (
              <div className="tab-placeholder-content">
                <p>No active promotional offers right now. Check back soon!</p>
              </div>
            )}

            {/* Search Card Trust Badges */}
            <div className="search-card-features">
              <div className="feature-item">
                <FaUserFriends className="feature-badge-icon" />
                <div>
                  <strong>Trusted by Millions</strong>
                  <span>1M+ Happy Customers</span>
                </div>
              </div>
              <div className="feature-item">
                <FaShieldAlt className="feature-badge-icon" />
                <div>
                  <strong>Best Price Guarantee</strong>
                  <span>Lowest Prices, Always</span>
                </div>
              </div>
              <div className="feature-item">
                <FaBus className="feature-badge-icon" />
                <div>
                  <strong>Wide Network</strong>
                  <span>5000+ Routes</span>
                </div>
              </div>
              <div className="feature-item">
                <FaLock className="feature-badge-icon" />
                <div>
                  <strong>Secure Booking</strong>
                  <span>Safe & Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Packages Section using your working PackageCard component */}
        <section className="package-section" ref={packageSectionRef}>
          <div className="section-header">
            <div>
              <h2>Top Holiday Packages</h2>
              <p>Handpicked packages for your next unforgettable trip</p>
            </div>
            <span
              className="view-all-link"
              onClick={() => navigate("/packages")}
            >
              View All Packages &gt;
            </span>
          </div>

          <div className="package-grid">
            {packages.map((pkg) => (
              <PackageCard key={pkg.packageId} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* 🤖 Inline Chatbot Section */}
        {/* 🤖 Floating Chatbot */}
        <Chatbot />

        {/* Bottom Trust Feature Footer Bar */}
        <section className="bottom-features-bar">
          <div className="bottom-feature-card">
            <FaCalendarCheck className="bottom-feat-icon" />
            <div>
              <h4>Easy Booking</h4>
              <p>Quick and hasslefree booking</p>
            </div>
          </div>
          <div className="bottom-feature-card">
            <FaHeadset className="bottom-feat-icon" />
            <div>
              <h4>24/7 Customer Support</h4>
              <p>We are here to help you anytime</p>
            </div>
          </div>
          <div className="bottom-feature-card">
            <FaExchangeAlt className="bottom-feat-icon" />
            <div>
              <h4>Flexible Cancellation</h4>
              <p>Cancel or reschedule with ease</p>
            </div>
          </div>
          <div className="bottom-feature-card">
            <FaMoneyCheckAlt className="bottom-feat-icon" />
            <div>
              <h4>Secure Payments</h4>
              <p>100% safe and secure payments</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
