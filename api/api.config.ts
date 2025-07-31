import axios, { AxiosInstance } from "axios";
import { getToken } from "./crypto";

// Force the correct API URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3800/api";

console.log("🔍 API Base URL configured as:", baseURL);

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to get token for request:", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export const API = api;
