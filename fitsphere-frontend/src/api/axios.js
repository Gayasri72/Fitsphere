import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api",
});

// Add a request interceptor to include the Authorization header
instance.interceptors.request.use(
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

export default instance;
