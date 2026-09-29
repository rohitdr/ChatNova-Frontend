import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import AuthContext from "../../../Context/AuthContext"
import { useNavigate } from "react-router-dom"
import { forgetPasswordApi } from "../services/auth.api"

export const useForgetPassword=()=>{
    const {showAlert,handleError}=useContext(AuthContext)
          const navigate=useNavigate()
    return useMutation({
    mutationFn:forgetPasswordApi,
    onError:handleError,
    onSuccess:()=>{
        showAlert("Success", "Your Password Has been successfully!");
      navigate("/login");
    
    }
})
}