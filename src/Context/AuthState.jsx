
import { useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import api from "../Api/Axios.jsx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import { messaging } from '../Firebase/firebase.cjs';

export default function AuthState(props) {
  const Navigate =useNavigate();
const [user,setUser]=useState(null)
 const [progress, setProgress] = useState(0);
 const refress_token=localStorage.getItem("refress_token")
 const [activePage,setActivePage]=useState(0)

// route to signup
const signUp=async(email,password,username)=>{
  setProgress(30)
        try{
      const res = await api.post('/auth/createUser',{email:email,password:password,username:username})
        setProgress(60)
      Navigate('/login')
        setProgress(100)
       }
       catch(error){
        console.log(error)
          setProgress(100)
       }
   
}
// Register service worker and get FCM token
async function initFCM() {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
 

    const currentToken = await getToken(messaging, {
      vapidKey:import.meta.env.VITE_VAPIEDKEY, // from Firebase console
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {

      try{
  const res = await api.post('/auth/deviceToken',{deviceToken:currentToken})
      }catch(error){
        console.log(error)
      }
    

    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.error('FCM registration error:', err);
  }
}




//  const getNoficationPermisson = async()=>{
//      const permisson = await Notification.requestPermission();
//      if(permisson==="granted"){
//       console.log("granted")
//     const token=  getToken(messaging,{
//         vapidKey:"c6ISY7gYj8TQSxxz_sENivgc8OIN6zJOwwh2mIzY-uM"
//       })
//           console.log(token)
//      }
 
//  }
const refreshUser=async()=>{

try{
    const res =await api.get('/auth/getUser')
    setUser(res.data.user)
 
}
catch(error){
  console.log("user is null")
 setUser(null)
}
}
const refreshSession=async()=>{

try{
   const refressRes=await api.post("/auth/refresh",{},{
            headers:{
                Authorization:`Bearer ${refress_token}`
            }
          })
          api.defaults.headers.common["Authorization"] = `Bearer ${refressRes.data.access_token}`
  console.log("refress is successfull")
}
catch(error){
  console.log("refress is not successfull")
    Navigate('/login')
}
}

  const login = async (email, password) => {
    try {
      setProgress(30);
  
      const response = await api.post('/auth/login',{email,password})
 
      setProgress(50);
 
    
       api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`
       localStorage.setItem("refress_token",response.data.refress_token)
       
        Navigate("/");
        setProgress(100);
      
    } catch (error) {
    
    
  
       
        setProgress(100);
     
    }
  };
  const logout = async () => {
    try {
      setProgress(30);
      const response = await api.post('/auth/logout')
      setProgress(50);
      if (response.status === 200) {
    
       localStorage.removeItem('refress_token')
       
        Navigate("/login");
        setProgress(100);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
      
        setProgress(100);
      }
    }
  };


const updateUserImage = async(file)=>{
  try{
  

      const formdata = new FormData();
    formdata.append("file",file)
    formdata.append("upload_preset",import.meta.env.VITE_UPLOAD_PRESET)
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,formdata)
    let image = {
      publicId:res.data.public_id,
      url:res.data.secure_url
    }
  const responseUpdate =await api.post('/auth/update',{image})
  
    refreshUser()
  }catch(error){
    console.log(error)
  }
}

useEffect(()=>{
if(!refress_token){
Navigate('/login')
}
else{
  refreshSession()
  refreshUser()
// Request permission and initialize FCM
Notification.requestPermission().then(async(permission) => {
  if (permission === 'granted') {
    initFCM();
  }
  else if(Notification.permission === "default"){
    await Notification.requestPermission();
  } else {

    console.log('Notification permission denied plese enable it ');
  }
});
}
},[refress_token])
  return (
    <AuthContext.Provider value={{user,signUp,updateUserImage,activePage,setActivePage,logout,setUser,progress,setProgress,login,refress_token}}>
  {props.children}
    </AuthContext.Provider>
      
   
  )
}
