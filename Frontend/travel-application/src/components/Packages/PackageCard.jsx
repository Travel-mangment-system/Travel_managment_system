import "./PackageCard.css";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  // Helper function to handle both new Cloudinary URLs and old local filenames
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/400x250?text=No+Image";
    }
    // If it is already a full web URL (like Cloudinary), use it directly
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Fallback for older packages still in the database
    return `http://localhost:8080/uploads/packages/${imagePath}`;
  };

  const imageUrl = resolveImageUrl(pkg.imageUrl);

  const handleViewDetails = () => {
    navigate(`/package-details/${pkg.packageId}`);
  };

  return (
    <div className="package-card">
      <div className="package-image-container">
        <img src={imageUrl} alt={pkg.title} className="package-image" />
        <span className="duration-badge">
          {pkg.durationDays}D / {pkg.durationNights}N
        </span>
      </div>

      <div className="package-content">
        <h3>{pkg.title}</h3>
        <p className="destination">📍 {pkg.destinationCity}</p>
        <p className="available">Available Seats : {pkg.availableSpots}</p>

        <div className="price-section">
          <div>
            <small>Starting From</small>
            <h2>₹ {pkg.basePrice}</h2>
          </div>
          <button onClick={handleViewDetails}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
