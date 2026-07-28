import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/home-banner.jpeg";
import "./HomePage.css";

import HomeNavbar from "../../components/Layout/HomeNavbar";
import PackageCard from "../../components/Packages/PackageCard";
import { getCustomerHomePackages } from "../../services/packageService";

const HomePage = () => {

    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);

    const [searchData, setSearchData] = useState({
        source: "",
        destination: "",
        journeyDate: ""
    });

    const packageSectionRef = useRef(null);

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {

        try {

            const response = await getCustomerHomePackages();

            console.log(response.data);

            setPackages(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });

    };

    const handleBusSearch = () => {

        navigate("/buses", {
            state: searchData
        });

    };

    const handleHolidayPackages = () => {

        packageSectionRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    };

    return (

        <>

            <HomeNavbar />

            <div className="home-page">

                {/* Hero Section */}

                <section
                    className="hero-section"
                    style={{
                        backgroundImage: `url(${heroImage})`
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
                            Book buses, explore holiday packages
                            and experience the world with us.
                        </p>

                    </div>

                    <div className="search-card">

                        <div className="search-tabs">

                            <button className="active-tab">
                                Bus Booking
                            </button>

                            <button onClick={handleHolidayPackages}>
                                Holiday Packages
                            </button>

                        </div>

                        <div className="search-form">

                            <input
                                type="text"
                                name="source"
                                placeholder="From"
                                value={searchData.source}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="destination"
                                placeholder="To"
                                value={searchData.destination}
                                onChange={handleChange}
                            />

                            <input
                                type="date"
                                name="journeyDate"
                                value={searchData.journeyDate}
                                onChange={handleChange}
                            />

                            <button
                                className="search-btn"
                                onClick={handleBusSearch}
                            >
                                Search Buses
                            </button>

                        </div>

                    </div>

                </section>

                {/* Popular Packages */}

                <section
                    className="package-section"
                    ref={packageSectionRef}
                >

                    <div className="section-header">

                        <h2>Popular Holiday Packages</h2>

                        <p>
                            Explore our most loved travel packages.
                        </p>

                    </div>

                    <div className="package-grid">

                        {packages.map((pkg) => (

                            <PackageCard
                                key={pkg.packageId}
                                pkg={pkg}
                            />

                        ))}

                    </div>

                </section>

            </div>

        </>

    );

};

export default HomePage;