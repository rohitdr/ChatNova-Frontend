import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/updateUser";
import { useContext } from "react";
import AuthContext from "../../../Context/AuthContext";

export const useUpdateUser=()=>{
    const {handleError,showAlert}=useContext(AuthContext)
    const queryClient=useQueryClient()
    return useMutation({
    mutationFn:({data,file})=>{
        return updateUser(data,file)},
    onError:handleError,
    onSuccess:()=>{
          queryClient.invalidateQueries(["Me"])
        showAlert("Success", "You information has been updated");
    }
})}