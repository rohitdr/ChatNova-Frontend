import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import AuthContext from "../../../Context/AuthContext"
import initFCM from "../../../Components/Notification"
import { useNavigate } from "react-router-dom"
import { loginApi } from "../services/auth.api"

export const useLogin=()=>{
    const {showAlert,handleError}=useContext(AuthContext)
      const queryClient=useQueryClient()
          const navigate=useNavigate()
    return useMutation({
    mutationFn:async (data)=>{
       const response =  await loginApi(data)
       return response
    },
    onError:handleError,
    onSuccess:async(response)=>{
           localStorage.setItem("accessToken",response.data.accessToken)
      await initFCM() 
     queryClient.invalidateQueries({
  queryKey: ["Me"],
});
        showAlert("Success", "You have been  logged in successfully!");
    
       
      navigate("/",{replace:true});
    
    }
})
}