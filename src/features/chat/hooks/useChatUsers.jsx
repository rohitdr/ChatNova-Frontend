import { useInfiniteQuery } from "@tanstack/react-query"
import { useMe } from "../../users/hooks/UseMe"
import { chattedUsers } from "../services/chatUser"


const useChatUsers = ()=>{
  const {data:Me}=useMe()
  return useInfiniteQuery({
    queryKey:["users"],
    queryFn:({pageParam=1})=>{ return chattedUsers(pageParam)},
    getNextPageParam:(lastPage)=>{
      if(lastPage.hasMore){
       return lastPage.page+1
      }
      return undefined
    },
      staleTime: 5000,
refetchOnWindowFocus: false,
enabled:!!Me

  })
}
export default useChatUsers;