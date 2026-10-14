import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import AuthContext from "../../../Context/AuthContext"
import { useNavigate } from "react-router-dom"
import { updatePasswordApi } from "../services/auth.api"

export const useChangePassword=()=>{
    const {showAlert,handleError}=useContext(AuthContext)
    const queryClient=useQueryClient()
          const navigate=useNavigate()
    return useMutation({
    mutationFn:(data)=>updatePasswordApi(data),
    onError:handleError,
    onSuccess:()=>{
          localStorage.removeItem("accessToken");
          queryClient.removeQueries()
          navigate("/login",{replace:true});
           showAlert("Success", "You Password has been updated");
    
    }
})
}