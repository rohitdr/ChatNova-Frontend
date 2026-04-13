import { useInfiniteQuery } from "@tanstack/react-query";


const useMessage =(id,getmessages)=>{
return useInfiniteQuery({
  queryKey:["messages",id],
  queryFn:({ pageParam, queryKey }) => {
      const [, id] = queryKey; 
      return getmessages(id,pageParam);
    },
  getNextPageParam:(lastPage)=>lastPage.nextCursor,
  staleTime: 5000,
refetchOnWindowFocus: false,
enabled:!!id,
  keepPreviousData:false
})
}
export default useMessage