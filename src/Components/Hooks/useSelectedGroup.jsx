import { useQuery } from "@tanstack/react-query"

 
 
 const useSelectedGroup=(id,isGroup,getGroupById)=>{
      return useQuery({
        queryKey:["Group",id],
        queryFn:({queryKey})=>{
          const [,id]=queryKey
          return getGroupById(id)
        },
        staleTime:5000,
        enabled:!!id && isGroup===true,
        refetchOnWindowFocus:false
      })
    }
    export default useSelectedGroup