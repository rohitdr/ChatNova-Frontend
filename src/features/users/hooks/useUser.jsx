import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/user.api";



const useUser=(id)=>{
  return useQuery({
    queryKey:["user",id],
    queryFn:async()=>{
      const response=await getUserById(id);
      return response.data.user
    },
    staleTime:5000,
    enabled:!!id,
    refetchOnWindowFocus:false,
     keepPreviousData:false
  })
}
export default useUser