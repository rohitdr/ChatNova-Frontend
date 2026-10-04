import { useQuery } from "@tanstack/react-query"
import { searchUserApi } from "../api/api"

 
 export const useSearchUsers=(value)=>{
      return useQuery({
     queryKey:["users",value],
        queryFn:async()=>{
         const response=await searchUserApi(value)
         return response.data.users
        },
        staleTime:5000,
        enabled:!!value,
        refetchOnWindowFocus:false
      })
    }
