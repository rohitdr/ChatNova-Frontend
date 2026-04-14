import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../Api/Axios.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  useQueryClient } from "@tanstack/react-query";
import { useMe } from "../Components/Hooks/UseMe.jsx";
import initFCM from "../Components/Notification.jsx";
import { forgetPasswordApi, getLoggedUserApi, loginApi, logoutApi, signUpApi, updatePasswordApi, updateUserApi } from "../Api/UsersApi.jsx";
import { uploadCloudinaryApi } from "../Api/MessageApi.jsx";

export default function AuthState(props) {
  const [isServerDown, setIsServerDown] = useState(false);
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [activePage, setActivePage] = useState(0);
  const [alert, setAlert] = useState(null);


  const queryClient = useQueryClient()
  const [authReady,setAuthReady]=useState(false)
  const showAlert =useCallback((type, message) => {
    setAlert({
      type: type,
      message: message,
    });
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
const token = localStorage.getItem('refreshToken')
if(!token){
  setAuthReady(true)
  return
}
try{
 await refreshSession()
}catch(error)
{
  console.log("Refress Failed")
  localStorage.clear()
}finally{
  setAuthReady(true)
}
}


 init();
  },[])
  // route to signup
  const signUp = async (email, password, username) => {
  
    try {
      await runWithProgress(async ()=>{
        const data={
        email: email,
        password: password,
        username: username,
      }
const response = await signUpApi(data)
    
        localStorage.setItem("accessToken",response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken);

      showAlert("Success", "You have been logged in successfully !");
     
      navigate("/additionaldetails");
  
      }) 
    } catch (error) {
      handleError(error)
    
    }
  };
 

  const getLoggedUser = async () => {
    try {
      const res = await getLoggedUserApi()
      return res.data.user
    } catch (error) {

     throw error
     
    }
  };


  const {data:Me,isLoading:isMeLoading}=useMe(getLoggedUser,authReady)

 

  const refreshSession = async () => {
    try {
       const response = await axios.post(`${import.meta.env.VITE_API}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          },
        );
    
        localStorage.setItem("accessToken",response.data.accessToken)
    
    } catch (error) {
   
    localStorage.clear();
    throw error
    
      
   
    }
  };

  const login = async (email, password) => {
    try {
  await runWithProgress(async()=>{
    const data ={ email, password }
 const response = await loginApi(data)



    
        localStorage.setItem("accessToken",response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken);
      await initFCM()
      queryClient.invalidateQueries(["Me"])
      navigate("/",{replace:true});
      showAlert("Success", "You have been logged in successfully !");
  
  })

     
    } catch (error) {
       handleError(error)

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
     
      }
  })
    
    } catch (error) {
       handleError(error)
    }
  };
/// update password when user is not login
  const forgetPassword = async (email,password,username) => {
    try {

  await runWithProgress(async()=>{
    const data={email:email,password:password,username:username}
const response = await forgetPasswordApi(data)
    
      if (response.status === 200) {
        
        showAlert("Success", "You Password has been changed successfully");
    
        navigate('/login')
    }})
      
      
    } catch (error) {
      handleError(error)
    }
  };
  /// update user information
  const updateUser = async (data) => {
    try {
    await runWithProgress(async()=>{

      const response = await updateUserApi(data)
    
      if (response.status === 200) {
       queryClient.invalidateQueries(["Me"])
        showAlert("Success", "You information has been updated");
       
      }
    })
  
    } catch (error) {
       handleError(error)
    }
  };
  const logout = async () => {
    try {
   
await logoutApi()
   
     
     
    } catch (error) {
      console.log("Logout API failed")
        }
        finally{
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          queryClient.removeQueries()
 
      
        showAlert("Success", "You have been logged out successfully !");
        navigate("/login");
        }
  };

  const updateUserImage = async (file) => {
    try {
  await runWithProgress(async()=>{
const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata);
    
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
      };
      const data = { image }
     await updateUserApi(data)
       queryClient.invalidateQueries(["Me"])
  })
   
    } catch (error) {
       handleError(error)
    }
  };


    // else {
    //   Notification.requestPermission().then(async (permission) => {
    //     if (permission === "granted") {
    //       initFCM();
    //     } else if (Notification.permission === "default") {
    //       await Notification.requestPermission();
    //     } else {
    //       console.log("Notification permission denied plese enable it ");
    //     }
    //   });
    // }

  return (
    <AuthContext.Provider
      value={{
        Me,
     authReady,
        updatePassword,
        updateUser,
        isServerDown,
        setIsServerDown,
        alert,
        showAlert,
        signUp,
        updateUserImage,
        activePage,
        setActivePage,
        logout,
        forgetPassword,
isMeLoading,
        progress,
        setProgress,
        login,
handleError
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

