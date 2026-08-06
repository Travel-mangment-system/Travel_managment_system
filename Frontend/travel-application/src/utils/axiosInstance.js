// import axios from "axios";

// const api = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1`,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// api.interceptors.request.use((config) => {

//     const token = localStorage.getItem("token");

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;

// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const publicUrls = ["/users/signin", "/users/signup"];

  const isPublic = publicUrls.some((url) => config.url.endsWith(url));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
