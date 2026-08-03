import axios from "axios";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080", // Pointing to your Spring Boot server
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add a Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Grab the token from localStorage right before the request leaves
    const token = localStorage.getItem("jwt_token");

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
