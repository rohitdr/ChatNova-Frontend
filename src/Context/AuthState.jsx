import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../Api/Axios.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "firebase/messaging";
import { messaging } from "../Firebase/firebase.cjs";
import { Socket } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AuthState(props) {
  const [isServer, setIsServer] = useState(0);
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);

  const [activePage, setActivePage] = useState(0);
  const [alert, setAlert] = useState(null);
  const [loadingUser,setLoadingUser]=useState(false)
  const [loadingMessages,setLoadingMessages] =useState(true)
  const queryClient = useQueryClient()
  const [authReady,setAuthReady]=useState(false)
  const showAlert = (type, message) => {
    setAlert({
      type: type,
      message: message,
    });
  };
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
    setProgress(30);
    try {
      const response = await api.post("/auth/createUser", {
        email: email,
        password: password,
        username: username,
      });
    
        localStorage.setItem("accessToken",response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken);

      showAlert("Success", "You have been logged in successfully !");
     
      Navigate("/additionaldetails");
      setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
         setIsServer(500)
          setProgress(100);
       
      }
    
      else{
      showAlert("Error", error.response.data.message);
        setProgress(100);
       
      }
    
    
    }
  };
  // Register service worker and get FCM token
  async function initFCM() {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPIEDKEY, // from Firebase console
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        try {
          const res = await api.post("/auth/deviceToken", {
            deviceToken: currentToken,
          });
        } catch (error) {
          const status = error.response?.status;
      if (status === 500) {
         setIsServer(500)
      
     
      }
     
      else{
         showAlert("Error", error.response.data.message);
      
      }
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one.",
        );
      }
    } catch (err) {
      console.error("FCM registration error:", err);
    }
  }

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/getUser");
   
  
      return res.data.user
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
         setIsServer(500)
      
   
      }
     
     
    }
  };


  const useMe=()=>{
    return useQuery({
      queryKey:["Me"],
      queryFn:refreshUser,
      staleTime:5000,
      // refetchOnWindowFocus:true,
    enabled:authReady
    })
  }
  const {data:Me}=useMe()

  const refreshSession = async () => {
    try {
       const refressRes = await axios.post(`${import.meta.env.VITE_API}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          },
        );
    
        localStorage.setItem("accessToken",refressRes.data.accessToken)
    
    } catch (error) {
   
    localStorage.clear();
    
      
   
    }
  };

  const login = async (email, password) => {
    try {
      setProgress(30);

      const response = await api.post("/auth/login", { email, password });

      setProgress(50);

    
        localStorage.setItem("accessToken",response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken);
    
      queryClient.invalidateQueries(["Me"])
      Navigate("/");
      showAlert("Success", "You have been logged in successfully !");
      setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
          setIsServer(500)
        setProgress(100);
      
      }
      else{
       
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }

    }
  };
/// update password when user is login
  const updatePassword = async (oldPassword,newPassword) => {
    try {
  
      setProgress(30);
      const response = await api.put("/auth/updatePassword",{oldPassword,newPassword});
      setProgress(50);
      if (response.status === 200) {
        refreshUser()
        showAlert("Success", "You Password has been updated");
        setProgress(100);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
           setIsServer(500)
        setProgress(100);
      }
     
      else{
        showAlert("Error", error.response.data.message);
     
     
          setProgress(100);
      }
    }
  };
/// update password when user is not login
  const forgetPassword = async (email,password,username) => {
    try {

      setProgress(30);
      const response = await api.put("/auth/forgetPassword",{email:email,password:password,username:username});
      setProgress(50);
      if (response.status === 200) {
        refreshUser()
        showAlert("Success", "You Password has been changed successfully");
        setProgress(100);
        Navigate('/login')
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
          setIsServer(500)
          setProgress(100);
      
      }
     
      else{
          showAlert("Error", error.response.data.message);
        setProgress(100);
      
      }
    }
  };
  /// update user information
  const updateUser = async (data) => {
    try {
  
      setProgress(30);
      const response = await api.post("/auth/update",data);
      setProgress(50);
      if (response.status === 200) {
        refreshUser()
        showAlert("Success", "You information has been updated");
        setProgress(100);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
        setProgress(100);
        setIsServer(500)
      }
     
      else{
         showAlert("Error", error.response.data.message);
      
          setProgress(100);
      }
    }
  };
  const logout = async () => {
    try {
      setProgress(30);
      const response = await api.post("/auth/logout");
      setProgress(50);
     
      if (response.status === 200) {
          queryClient.clear()
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
 
      
        showAlert("Success", "You have been logged out successfully !");
        Navigate("/login");
        setProgress(100);
      }
      
    } catch (error) {
      const status = error.response?.status;
      if (status === 500) {
          setIsServer(500)
          setProgress(100);
      
      }
    }
  };

  const updateUserImage = async (file) => {
    try {
        setProgress(30);
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,
        formdata,
      );
        setProgress(60);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
      };
      const responseUpdate = await api.post("/auth/update", { image });
  
    
        setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
     
      else{
      
        setIsServer(500)
          setProgress(100);
      
      }
    }
  };

  useEffect(() => {
    const refreshToken=localStorage.getItem("refreshToken");
    if (!refreshToken) {
      Navigate("/login");
    } else {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          initFCM();
        } else if (Notification.permission === "default") {
          await Notification.requestPermission();
        } else {
          console.log("Notification permission denied plese enable it ");
        }
      });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        Me,
        user,
        updatePassword,
        updateUser,
        isServer,
        setIsServer,
        alert,
        showAlert,
        signUp,
        updateUserImage,
        activePage,
        setActivePage,
        logout,
        forgetPassword,
        setUser,
        progress,
        setProgress,
        login,
        
        loadingUser,
        setLoadingUser,
        setLoadingMessages,
        loadingMessages
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
