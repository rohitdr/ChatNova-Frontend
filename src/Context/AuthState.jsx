import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../Api/Axios.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "firebase/messaging";
import { messaging } from "../Firebase/firebase.cjs";

export default function AuthState(props) {
  const [isServer, setIsServer] = useState(0);
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);
  const refress_token = localStorage.getItem("refress_token");
  const [activePage, setActivePage] = useState(0);
  const [alert, setAlert] = useState(null);
  const showAlert = (type, message) => {
    setAlert({
      type: type,
      message: message,
    });
  };
  // route to signup
  const signUp = async (email, password, username) => {
    setProgress(30);
    try {
      const res = await api.post("/auth/createUser", {
        email: email,
        password: password,
        username: username,
      });
      setProgress(60);
      showAlert("Success","Signed up successfully ! You can login now")
      Navigate("/login");
      setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
    
      else{
        console.log(error)
        setIsServer(500)
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
      if (status === 404) {
        showAlert("Error", error.response.data.message);
     
      }
     
      else{
   console.log(error)
        setIsServer(500)
      
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
      setUser(res.data.user);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
   
      }
     
      else{
         console.log(error)
        setIsServer(500)
      
      }
    }
  };

  const refreshSession = async () => {
    try {
      const refressRes = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refress_token}`,
          },
        },
      );
      api.defaults.headers.common["Authorization"] =
        `Bearer ${refressRes.data.access_token}`;
      console.log("refress is successfull");
    } catch (error) {
     const status = error.response?.status;
    if(status ===500){
      console.log(error)
   setIsServer(500)

    }
    
      
   
    }
  };

  const login = async (email, password) => {
    try {
      setProgress(30);

      const response = await api.post("/auth/login", { email, password });

      setProgress(50);

      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.access_token}`;
      localStorage.setItem("refress_token", response.data.refress_token);

      Navigate("/");
      showAlert("Success", "You have been logged in successfully !");
      setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
      else{
          console.log(error)
        setIsServer(500)
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
        localStorage.removeItem("refress_token");
        showAlert("Success", "You have been logged out successfully !");
        Navigate("/login");
        setProgress(100);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
     
      else{
          console.log(error)
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
    
      refreshUser();
        setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
     
      else{
          console.log(error)
        setIsServer(500)
          setProgress(100);
      
      }
    }
  };

  useEffect(() => {
    if (!refress_token) {
      Navigate("/login");
    } else {
      refreshSession();
      refreshUser();
      // Request permission and initialize FCM
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
  }, [refress_token]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isServer,
        setIsServer,
        alert,
        showAlert,
        signUp,
        updateUserImage,
        activePage,
        setActivePage,
        logout,
        setUser,
        progress,
        setProgress,
        login,
        refress_token,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
