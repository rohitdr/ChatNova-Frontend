import api from "./Axios";










export const refreshApi =()=>{
   return  api.post("/auth/refresh");
}
