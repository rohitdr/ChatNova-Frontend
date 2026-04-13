import { useQuery } from "@tanstack/react-query"

 
 const useGroups =(getAllGroups,Me)=>{
  return useQuery({
    queryKey:["groups"],
    queryFn:getAllGroups,
    staleTime:5000,
    refetchOnWindowFocus:false,
    enabled:!!Me
  })
 }
 export default useGroups