import { useQuery } from "@tanstack/react-query"


 export const useMe=(getLoggedUser,authReady,)=>{
    
    return useQuery({
      queryKey:["Me"],
      queryFn:getLoggedUser,
      staleTime:5000,
    enabled:authReady && !!localStorage.getItem("accessToken"),
    retry:false
    })
  }

