import { useQuery } from "@tanstack/react-query"
import { getConversationById } from "../api/api"

 
 
 export const useConversation=(id)=>{
      return useQuery({
        queryKey:["conversation",id],
        queryFn:async()=>{
         const response=await getConversationById(id)
         return response.data.conversation
        },
        staleTime:5000,
        enabled:!!id,
        refetchOnWindowFocus:false
      })
    }
