import axios, { AxiosInstance } from "axios";
import { getToken } from "./crypto";

const baseURL = process.env.NEXT_PUBLIX_API_URL || "";

const api: AxiosInstance = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API = api;
