import api from "../utils/axiosInstance";

export const createPackage = (packageData) => {
    return api.post("/admin/packages", packageData);
};

export const getHolidayPackages = async () => {
    const response = await api.get("/admin/packages");
    return response.data;
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