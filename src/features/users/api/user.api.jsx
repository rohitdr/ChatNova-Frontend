import api from "../../../Api/Axios";

export const getLoggedUserApi =()=>{
   return  api.get("/auth/getUser");
}