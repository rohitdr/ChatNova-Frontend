import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import AuthContext from "../../Context/AuthContext"

export const useAuthMutations=()=>{
    const {showAlert,updateUser,handleError}=useContext(AuthContext)

    const queryClient=useQueryClient()

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
    userUpdatedMutation
    }
}
