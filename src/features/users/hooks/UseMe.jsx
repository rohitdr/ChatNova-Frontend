import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { getLoggedUserApi } from './../api/user.api';
import AuthContext from "../../../Context/AuthContext";


 export const useMe=()=>{
    const { authReady }=useContext(AuthContext)
    return useQuery({
      queryKey:["Me"],
      queryFn:async () => {
  
      const res = await getLoggedUserApi()
      return res.data.user
   
  },
      staleTime:5000,
    enabled:authReady && !!localStorage.getItem("accessToken"),
    retry:false
    })
  }

