import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendMessageApi, uploadCloudinaryApi } from "../../Api/MessageApi"
import { useContext } from "react"


export const useUploadMediaMutation=(uploadCloudinary,handleError)=>{
    const queryclient=useQueryClient()
    return useMutation({
        onMutate:async({conversationId,message})=>{
           await queryclient.cancelQueries({
    queryKey: ["messages", conversationId],
  });
        const previousMessages=queryclient.getQueryData(["messages",conversationId])
             queryclient.setQueryData(["messages",conversationId],(oldData)=>{
  if(!oldData) return oldData
  const newPages = [...oldData.pages]
  newPages[0] = {
  ...newPages[0],
  message: [message, ...newPages[0].message],
};
   return {...oldData,pages:newPages}
 })
 return {previousMessages}
        },
         mutationFn: async({conversationId,file,tempId})=>{
        
        
                      await uploadCloudinary(conversationId, file, tempId)
         },
     onError: (error,variables,context)=>{
 handleError(error)
 if(context?.previousMessages){
 queryclient.setQueryData(["messages",variables.conversationId],context.previousMessages)
 }
     },
     onSettled:(_data,_error,variables)=>{
    if(variables?.previewUrl){
     URL.revokeObjectURL(variables.previewUrl)
    }
     }
    })
}
