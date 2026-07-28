import api from "../utils/axiosInstance";

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