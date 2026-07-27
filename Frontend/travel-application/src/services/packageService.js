import api from "./api";

export const getHolidayPackages = async () => {
  try {
    const response = await api.get("/api/v1/admin/packages");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch packages";
  }
};