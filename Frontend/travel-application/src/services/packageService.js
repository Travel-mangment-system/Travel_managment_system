import api from "../utils/axiosInstance";

// ===============================
// ADMIN PACKAGE APIs
// ===============================

export const createPackage = (formData) => {
    return api.post(
        "/admin/packages",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const getAllBuses = () => {
    return api.get("/buses");
};

export const addItinerary = (packageId, itinerary) => {
    return api.post(
        `/admin/packages/${packageId}/itineraries`,
        itinerary
    );
};

export const getAllPackages = () => {
    return api.get("/admin/packages");
};

// ===============================
// CUSTOMER PACKAGE APIs
// ===============================

export const getCustomerHomePackages = () => {
    return api.get("/customer/packages");
};

export const getCustomerPackageDetails = (packageId) => {
    return api.get(`/customer/packages/${packageId}`);
};