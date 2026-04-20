import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});
api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("accessToken")
  if(token){
    config.headers.Authorization=`Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
         const refressRes = await api.post("/auth/refresh");
         localStorage.setItem("accessToken", refressRes.data.accessToken);

originalRequest.headers.Authorization = `Bearer ${refressRes.data.accessToken}`;

return api(originalRequest);
      
      } catch(error) {
        console.log(error)
        localStorage.clear()
    
      }
    }
  
    return Promise.reject(error);
  },
);

export default api;
