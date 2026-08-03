import api from "./api";

export const searchBuses = async (source, destination, date) => {
  try {
    // 1. Format the date to ONLY be "YYYY-MM-DD"
    let formattedDate = date;

    if (date && typeof date === "string") {
      // This chops off the ", Friday" part so JavaScript can read the date properly
      const cleanDateString = date.split(",")[0].trim();

      const dateObj = new Date(cleanDateString);

      // Convert it to standard YYYY-MM-DD
      if (!isNaN(dateObj)) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }
    }

    // 2. Grab the token from localStorage (matching the key from your Login.jsx)
    const token = localStorage.getItem("token");

    // 3. Send the request with the clean date and the auth token
    const response = await api.get("/api/v1/buses/search", {
      params: {
        source: source,
        destination: destination,
        date: formattedDate, // This will now purely be "2024-05-24"
      },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};
