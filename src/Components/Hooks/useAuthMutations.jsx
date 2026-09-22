import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginApi, signUpApi } from "../../Api/UsersApi"
import initFCM from "../Notification"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../../Context/AuthContext"

export const useAuthMutations=(handleError)=>{
    const {showAlert,updateUser}=useContext(AuthContext)
    const navigate=useNavigate()
    const queryClient=useQueryClient()
const loginMutation=useMutation({
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
const signUpMutation=useMutation({
    mutationFn:async(data)=>{
        const response = await signUpApi(data)
        return response
    },
    onError:handleError,
    onSuccess:(response)=>{

            localStorage.setItem("accessToken",response.data.accessToken)
      showAlert("Success", "You have been logged in successfully !");
     
      navigate("/additionaldetails");
    }
})
const userUpdatedMutation=useMutation({
    mutationFn:({data,file})=>{
        return updateUser(data,file)},
    onError:handleError,
    onSuccess:()=>{
          queryClient.invalidateQueries(["Me"])
        showAlert("Success", "You information has been updated");
    }
})

    return{
    loginMutation,
    signUpMutation,
    userUpdatedMutation
    }
}
