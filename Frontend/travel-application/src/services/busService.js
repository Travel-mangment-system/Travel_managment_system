import api from "./api"; // Your Axios instance setup by Developer 1

export const searchBuses = async (source, destination, date) => {
  try {
    // Replace with your actual backend endpoint
    const response = await api.get("/api/v1/buses/search", {
      params: { source, destination, date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};
