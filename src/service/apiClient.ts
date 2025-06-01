import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("googleAccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
