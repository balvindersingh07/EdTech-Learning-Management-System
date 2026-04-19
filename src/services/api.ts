import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("lms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string } | string>) => {
    const data = error.response?.data;
    let message: string;
    if (typeof data === "string") {
      message = data.trim().startsWith("<") ? "Server error — check that the API is running." : data;
    } else if (data && typeof data === "object" && "message" in data && data.message) {
      message = String(data.message);
    } else if (error.code === "ERR_NETWORK") {
      message = "Network error — cannot reach the API.";
    } else {
      message = error.message ?? "Request failed";
    }
    return Promise.reject(new Error(message));
  },
);
