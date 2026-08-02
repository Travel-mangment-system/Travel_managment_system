import "./PackageCard.css";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ pkg }) => {

    const navigate = useNavigate();

    const imageUrl = `http://localhost:8080/uploads/packages/${pkg.imageUrl}`;

    const handleViewDetails = () => {

        navigate(`/package-details/${pkg.packageId}`);

    };

    return (

        <div className="package-card">

            <div className="package-image-container">

                <img
                    src={imageUrl}
                    alt={pkg.title}
                    className="package-image"
                />

                <span className="duration-badge">
                    {pkg.durationDays}D / {pkg.durationNights}N
                </span>

            </div>

            <div className="package-content">

                <h3>{pkg.title}</h3>

                <p className="destination">
                    📍 {pkg.destinationCity}
                </p>

                <p className="available">
                    Available Seats : {pkg.availableSpots}
                </p>

                <div className="price-section">

                    <div>

                        <small>Starting From</small>

                        <h2>₹ {pkg.basePrice}</h2>

                    </div>

                    <button onClick={handleViewDetails}>
                        View Details
                    </button>

                </div>

            </div>

        </div>

    );

};

export default PackageCard;