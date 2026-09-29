import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

import { useNavigate } from "react-router-dom";
import {  useQueryClient } from "@tanstack/react-query";
import { useMe } from "../features/users/hooks/UseMe.jsx";
import {  logoutApi, refreshApi, updatePasswordApi, updateUserApi } from "../Api/UsersApi.jsx";
import { uploadCloudinaryApi } from "../Api/MessageApi.jsx";

export default function AuthState(props) {
  const [isServerDown, setIsServerDown] = useState(false);
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [activePage, setActivePage] = useState(0);
  const [alert, setAlert] = useState([]);

  const queryClient = useQueryClient()
  const [authReady,setAuthReady]=useState(false)
  const showAlert =useCallback((type, message) => {
    const id=Date.now()
    setAlert(prev=>([
      ...prev,
      {
        id,
        type: type,
      message: message}]
    ));
    // setTimeout(() => {
    //   setAlert(prev=>prev.filter((prev)=>prev.id!==id));
    // }, 3500);
  },[])

const handleError =(error)=>{
  if(!error.response){
    showAlert("Error","Network error. Please check your connection")
    return
    
  }
  const status = error.response?.status;
   if(status>=500){
    setIsServerDown(true)
    
   }
   else if(status === 401 || status === 403){
   showAlert("Error","Session expired. Please Login again")

   }
   else if(status >=400){
    showAlert("Error",error.response?.data?.message || "Something went wrong")
  

   }
   else{
    showAlert("Error","Unexpected error occurred")

   }
}

const runWithProgress =async(fn,show=true)=>{
  try{
    if(show)
      {
        setProgress(30)
         setTimeout(() => setProgress(40), 200);
      setTimeout(() => setProgress(70), 400);

      }
      return await fn()

  }

  finally{ 
  if(show){

    setProgress(100)
      setTimeout(() => setProgress(0), 300);
  }
  }

}







  useEffect(()=>{
const init=async()=>{
const token = localStorage.getItem('accessToken')
if(!token){
  setAuthReady(true)
  return
}
try{
 await refreshSession()
}catch(error)
{
  console.log("Refress Failed"+error.message)
  localStorage.clear()
}finally{
  setAuthReady(true)
}
}


 init();
  },[])






  const refreshSession = async () => {
    try {
       const response = await refreshApi();
    
        localStorage.setItem("accessToken",response.data.accessToken)
    
    } catch (error) {
    localStorage.clear();
    throw error
    
      
   
    }
  };


/// update password when user is login
  const updatePassword = async (oldPassword,newPassword) => {
    try {
  await runWithProgress(async()=>{
    const data ={oldPassword,newPassword}
      const response = await updatePasswordApi(data)
  
      if (response.status === 200) {
     queryClient.invalidateQueries(["Me"])
       showAlert("Success", "You Password has been updated");
       setTimeout(async() => {
           await logout()
       }, 500);
  
      }
  })
    
    } catch (error) {
       handleError(error)
    }
  };

  /// update user information
  const updateUser = async (data,file) => {

      if(file){
const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
      };
      
       data.image =  image 

      }
      const response = await updateUserApi(data)
return response.data
  
  };
  const logout = async () => {
    try {
await logoutApi()
     
    } catch (error) {
      console.log("Logout API failed")
        }
        finally{
          
          localStorage.removeItem("accessToken");
          queryClient.removeQueries()
 
      
        showAlert("Success", "You have been logged out successfully !");
        navigate("/login");
        }
  };

  const updateUserImage = async (file) => {
    try {
  await runWithProgress(async()=>{

     await updateUserApi(data)
       queryClient.invalidateQueries(["Me"])
  })
    } catch (error) {
       handleError(error)
    }
  };


  

  return (
    <AuthContext.Provider
      value={{
     authReady,
        updatePassword,
        updateUser,
        isServerDown,
        setIsServerDown,
        alert,
        showAlert,
    
        updateUserImage,
        activePage,
        setActivePage,
        logout,
        progress,
        setProgress,
       
handleError,
setAlert
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

