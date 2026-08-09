import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CustomerLayout from "../../components/Layout/CustomerLayout";
import { getCustomerPackageDetails } from "../../services/packageService";

import "./PackageDetails.css";

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    loadPackage();
  }, [packageId]);

  const loadPackage = async () => {
    try {
      const response = await getCustomerPackageDetails(packageId);
      setPkg(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  // Helper function to handle both new Cloudinary URLs and old local filenames
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `http://localhost:8080/uploads/packages/${imagePath}`;
  };

  if (!pkg) {
    return (
      <CustomerLayout>
        <div className="package-details-loading">
          <h2>Loading Package...</h2>
        </div>
      </CustomerLayout>
    );
  }

  // Use the helper function here
  const imageUrl = resolveImageUrl(pkg.imageUrl);

  return (
    <CustomerLayout>
      <div className="package-details">
        <div className="details-container">
          {/* LEFT SIDE */}
          <div className="details-left">
            <div className="title-section">
              <div>
                <h1>{pkg.title}</h1>
                <h3>📍 {pkg.destinationCity}</h3>
              </div>
              <button
                className="book-btn"
                onClick={() => {
                  localStorage.setItem("packageId", pkg.packageId);
                  navigate(`/package-booking/${pkg.packageId}`, {
                    state: {
                      holidayPackage: pkg,
                    },
                  });
                }}
              >
                Book Now
              </button>
            </div>

            <div className="description-card">
              <h2>About This Package</h2>
              <p>{pkg.description}</p>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h4>Duration</h4>
                <p>
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </p>
              </div>
              <div className="info-card">
                <h4>Departure</h4>
                <p>{formatDate(pkg.departureDatetime)}</p>
              </div>
              <div className="info-card">
                <h4>Return</h4>
                <p>{formatDate(pkg.returnDatetime)}</p>
              </div>
              <div className="info-card">
                <h4>Available Seats</h4>
                <p>{pkg.availableSpots}</p>
              </div>
              <div className="info-card">
                <h4>Price</h4>
                <p>₹ {pkg.basePrice}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="details-right">
            <img src={imageUrl} alt={pkg.title} />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default PackageDetails;
