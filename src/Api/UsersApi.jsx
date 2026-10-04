import api from "./Axios";







export const updatePasswordApi =(data)=>{
   return  api.put("/auth/updatePassword",data);
}

export const updateUserApi =(data)=>{
   return  api.post("/auth/update",data);
}

export const refreshApi =()=>{
   return  api.post("/auth/refresh");
}
