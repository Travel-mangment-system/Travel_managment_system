import axios from "axios";

const api = axios.create({
  // Change this to match your Spring Boot port if it is not 8080
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
