import axios from "axios";

const rawApiBaseUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiBaseUrl = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/$/, "")
  : "/api";

const apiBaseUrl = normalizedApiBaseUrl.endsWith("/api")
  ? normalizedApiBaseUrl
  : `${normalizedApiBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
