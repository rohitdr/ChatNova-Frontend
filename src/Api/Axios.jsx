import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        const refressRes = await api.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refress_token")}`,
            },
          },
        );
        api.defaults.headers.common["Authorization"] =
          `Bearer ${refressRes.data.access_token}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${refressRes.data.access_token}`;
        return api(originalRequest);
      } catch(error) {
        
     console.log(error)
      }
    }
  
    return Promise.reject(error);
  },
);

export default api;
