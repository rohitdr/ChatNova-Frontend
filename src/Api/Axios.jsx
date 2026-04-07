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
    const refreshToken =localStorage.getItem("refreshToken")
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" && 
    refreshToken
    ) {
      originalRequest._retry = true;
      try {
         const refressRes = await axios.post(`${import.meta.env.VITE_API}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
     
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
