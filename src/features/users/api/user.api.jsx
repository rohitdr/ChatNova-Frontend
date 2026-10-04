import api from "../../../Api/Axios";

export const getLoggedUserApi =()=>{
   return  api.get("/auth/getUser");
}
export const getUserById =(id)=>{
   return  api.get(`/users/getUser/${id}`);
}