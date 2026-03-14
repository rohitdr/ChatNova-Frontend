
import { useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import api from "../Api/Axios.jsx";
import { useNavigate } from 'react-router-dom';

export default function AuthState(props) {
  const Navigate =useNavigate();
const [user,setUser]=useState(null)
 const [progress, setProgress] = useState(0);
 const refress_token=localStorage.getItem("refress_token")

const refreshSession=async()=>{

try{
    const res =await api.get('/auth/getUser')
 
    setUser(res.data.user)
 
}
catch(error){
  console.log("user is null")
 setUser(null)
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




useEffect(()=>{
if(!refress_token){
Navigate('/login')
}
else{
  refreshSession()
}
},[refress_token])
  return (
    <AuthContext.Provider value={{user,logout,setUser,progress,setProgress,login,refress_token}}>
  {props.children}
    </AuthContext.Provider>
      
   
  )
}
