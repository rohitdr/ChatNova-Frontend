import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { signUpApi } from "../services/auth.api"
import AuthContext from "../../../Context/AuthContext"

export const useSignUp=()=>{
    const {showAlert,handleError}=useContext(AuthContext)
    const navigate=useNavigate()
       return useMutation({
    mutationFn:async(data)=>{
        const response = await signUpApi(data)
        return response
    },
    onError:handleError,
    onSuccess:(response)=>{
            localStorage.setItem("accessToken",response.data.accessToken);
      showAlert("Success", "You have been logged in successfully !");
      navigate("/additionaldetails");
    }
})
}