import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";


import {  useQueryClient } from "@tanstack/react-query";
import {   refreshApi } from "../Api/UsersApi.jsx";

export default function AuthState(props) {
  const [isServerDown, setIsServerDown] = useState(false);
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




  /// update user information



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
        isServerDown,
        setIsServerDown,
        alert,
        showAlert,
    
        updateUserImage,
        activePage,
        setActivePage,
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

