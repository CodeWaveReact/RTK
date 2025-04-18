import axios from "axios";
import { clearLocalStorage, getLocalStorage } from "../utils/auth";

// Axios set baseURL and Content-Type
export const axiosInstance = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor request
axiosInstance.interceptors.request.use(
  (config) => {
    // get token from local storage
    const token = getLocalStorage("access_token");
    // if token is exist, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearLocalStorage();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return Promise.reject(error);
  }
);
