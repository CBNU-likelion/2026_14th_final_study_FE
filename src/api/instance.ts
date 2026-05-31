import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../utils/token";

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await api.post("/auth/reissue", { refreshToken });

        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    }

    return Promise.reject(error);
  }
);

export default api;
