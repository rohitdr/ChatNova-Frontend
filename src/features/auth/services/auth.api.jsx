import api from "../../../Api/Axios";

export const loginApi =(data)=>{
   return  api.post("/auth/login",data );
}
export const signUpApi =(data)=>{
   return  api.post("/auth/createUser",data );
}
export const forgetPasswordApi =(data)=>{
   return  api.put("/auth/forgetPassword",data);
}