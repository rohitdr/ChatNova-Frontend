import  { useCallback, useContext, useEffect, useMemo, useState } from "react";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";
import {
  MagnifyingGlassIcon,

  PlusIcon,
} from "@heroicons/react/24/outline";
import ChatNovaContext from "../Context/ChatNovaContext";
import SocketContext from "../Context/SocketContext";
import UserSkeleton from "./UserSkeleton";
import UserItem from "./UserItem";

export default function Group() {
 
  const {socket}= useContext(SocketContext)
  const { isServerDown,setActivePage,Me } =   useContext(AuthContext);
  const {
    setIsGroup,
  
    allGroup,
    isAllGroupLoading,
    setActiveChat,
   queryClient,
    setConversationId,
    conversationId,
    setActiveGroupChat,
  
    
  } = useContext(ChatNovaContext);
  const [filteredGroups,setFilteredGroups]=useState([])
  const [searchClick, setSearchClick] = useState(true);
  const handleChange = ({target:{value}}) => {
    if (value.trim().length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
    let filteredgroups = allGroup?.filter((grp)=>grp.name.toString().includes(value.toString())) || []
  setFilteredGroups(filteredgroups)
    }
  };
 

  const handleGroupClick = useCallback((element) => {
    if(!socket) return
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
     socket.emit("join_group",element._id)
     socket.emit("mark_seen",{conversationId:element._id,userId:Me?._id})
     setConversationId(element._id)
     setActiveGroupChat(true);
     setActiveChat(true);
      setIsGroup(true)
  },[socket,conversationId,Me?._id]);

  useEffect(()=>{
    if (!socket) return
    const groupHandler =(newGroup)=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== newGroup._id)
          return [newGroup,...filterd]
      })

    queryClient.invalidateQueries(["groups"]);

     
    }
    const groupLeaveHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })
      
    queryClient.invalidateQueries(["groups"]);
     
    }
      const addedHandler =({groupId,conversationToSend})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return [conversationId]
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [conversationToSend,...filterd]
      })
     
    queryClient.invalidateQueries(["groups"]);

     
    }
     const removedHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })
      
    queryClient.invalidateQueries(["groups"]);

     if(conversationId === groupId){
  
    queryClient.removeQueries({ queryKey: ['Group',conversationId] });
      setActivePage(2)
      setActiveGroupChat(false)
      setConversationId(null)
      setActiveChat(false)
     }
     
    }
      const groupDeleteHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })
      
    queryClient.invalidateQueries(["groups"]);

     if(conversationId === groupId){
  
    queryClient.removeQueries({ queryKey: ['Group',conversationId] });
      setActivePage(2)
      setActiveGroupChat(false)
      setConversationId(null)
      setActiveChat(false)
     }
     
    }
     socket.on("group_deleted",groupDeleteHandler)
      socket.on("group_leaved",groupLeaveHandler)
    socket.on("group_created",groupHandler)
     socket.on("added_to_group",addedHandler)
       socket.on("removed_from_group",removedHandler)
   return ()=>{
    socket.off("group_created",groupHandler)
     socket.off("group_leaved",groupLeaveHandler)
      socket.off("added_to_group",addedHandler)
        socket.off("removed_from_group",removedHandler)
          socket.off("group_deleted",groupDeleteHandler)
   }
  },[socket,conversationId,queryClient])
 
 

  const normalizeItem =useCallback((element,type)=>{
    
    const participant = element.participents?.find(
  (p) => p.user.toString() === Me._id
);

    if(type==="chat"){
         return{
          element,
          name:element.name,
          image:element.avtar?.url,
          lastMessage:element.lastMessage,
           _id:element._id,
             unreadCount:participant?.unreadCount ||0
         }
         
        }
        if(type==="search"){
        return{
           element,
         name:element.name,
         image:element.avtar?.url,
         lastMessage:null,
         _id:element._id,
           unreadCount:0
        }
        }
    
    
  },[Me?._id])
const allNormalizedGroups= useMemo(()=>{return allGroup?.map((element)=>

   normalizeItem(element,"chat")
)},[normalizeItem,allGroup])
const filteredNormalizedGroups=useMemo( ()=>{return filteredGroups?.map((element)=>
  normalizeItem(element,"search")
)},[normalizeItem,filteredGroups])
const handleCreateGroupClick=()=>{
  setActivePage(5)
}
  return isServerDown ? (
    <NoServer></NoServer>
  ) : (
    <>
      <div className="h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-gradient-to-br from-indigo-50 to-purple-50 flex-col">
        <div className="flex justify-between">
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Groups</div>
          <div className="pt-2">
            {" "}
            <PlusIcon className="w-6 h-6 sha mx-2 text-blue-700 cursor-pointer"  onClick={handleCreateGroupClick}/>
          </div>
        </div>

        <div className="flex p-2 pr-0 rounded-xl border-none mx-4 my-2  bg-white">
          <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
          <input
            type="search"
            className="w-full  outline-none pl-2"
            onChange={handleChange}
            placeholder="Search messages or users"
            name="usersearch"
            id="usersearch"
          />
        </div>

        <div className="flex pt-2 flex-col mb-14 lg:mb-0 p-2 px-4 overflow-y-auto scrollbar-hide">
          {!searchClick &&
            filteredNormalizedGroups &&
            filteredNormalizedGroups.length !== 0 &&
            filteredNormalizedGroups.map((element) => {
              return (
          
              <UserItem key={element._id} user={element}  handleUserClick={handleGroupClick}></UserItem>
              );
            })}
          {!isAllGroupLoading ? searchClick && allNormalizedGroups && allNormalizedGroups.length !== 0 && (
            allNormalizedGroups.map((element) => {
              return ( 
                <div className="h-[72px]" key={element._id}>
                 <UserItem  user={element}  handleUserClick={handleGroupClick}></UserItem></div>
              );
            })
          ):[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
        </div>
      </div>
    </>
  );
}
