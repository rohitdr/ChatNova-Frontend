import api from "./Axios";


export const searchUserApi =(value)=>{
   return api.get(`/users/search?search=${value}`);
}
export const chattedUsersApi =(limit,page)=>{
   return  api.get(`/users/chattedUsers?limit=${limit}&page=${page}`);
}
export const getCurrentChattingUserApi =(id)=>{
   return  api.get(`/users/getUser/${id}`);
}
export const signUpApi =(data)=>{
   return  api.post("/auth/createUser",data );
}
export const getLoggedUserApi =()=>{
   return  api.get("/auth/getUser");
}
export const loginApi =(data)=>{
   return  api.post("/auth/login",data );
}
export const updatePasswordApi =(data)=>{
   return  api.put("/auth/updatePassword",data);
}
export const forgetPasswordApi =(data)=>{
   return  api.put("/auth/forgetPassword",data);
}
export const updateUserApi =(data)=>{
   return  api.post("/auth/update",data);
}
export const logoutApi =()=>{
   return  api.post("/auth/logout");
}
export const refreshApi =()=>{
   return  api.post("/auth/refresh");
}
