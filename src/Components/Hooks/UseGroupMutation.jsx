import { useMutation } from "@tanstack/react-query"
import { addMemberApi, createGroupApi, deleteGroupApi, leaveGroupApi, removeMemberApi } from "../../Api/GroupApi"

export const useGroupMutation=(handleError)=>{

    const addMemberMutation = useMutation({
        mutationFn:addMemberApi,
         onError:handleError
    })
    const removeMemberMutation = useMutation({
        mutationFn:removeMemberApi,
         onError:handleError
    })
    const deleteGroupMutation = useMutation({
        mutationFn:deleteGroupApi,
         onError:handleError
        
    })
    const createGroupMutation = useMutation({
        mutationFn:createGroupApi,
         onError:handleError
    })
    const leaveGroupMutation = useMutation({
        mutationFn:leaveGroupApi,
         onError:handleError
    })
    return{
        addMemberMutation,
        createGroupMutation,
        deleteGroupMutation,
        removeMemberMutation,
        leaveGroupMutation
    }
}
