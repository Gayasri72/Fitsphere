import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // localStorage.removeItem('token');
        window.location.href = "/login";
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }

      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        if (!localStorage.getItem("token")) {
          window.location.href = "/login";
          return Promise.reject(new Error("Please login to continue."));
        }
        console.error("Authorization error:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
