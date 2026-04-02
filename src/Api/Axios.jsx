import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});
api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("access_token")
  if(token){
    config.headers.Authorization=`Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token =localStorage.getItem("refress_token")
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" && 
    token
    ) {
      originalRequest._retry = true;
      try {
        const refressRes = await api.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
     
          localStorage.setItem("access_token",refressRes.data.access_token)
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
