import { useQuery } from "@tanstack/react-query";



const useSelectedUser=(id,getCureentChattingUser)=>{
  return useQuery({
    queryKey:["user",id],
    queryFn:({queryKey }) => {
      const [, id] = queryKey; 
      return getCureentChattingUser( id);
    },
    staleTime:5000,
    enabled:!!id,
    refetchOnWindowFocus:false,
     keepPreviousData:false
  })
}
export default useSelectedUser