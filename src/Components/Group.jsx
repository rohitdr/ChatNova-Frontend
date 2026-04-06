import React, { useContext, useEffect, useState } from "react";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";
import {
  MagnifyingGlassIcon,
  MagnifyingGlassCircleIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ChatNovaContext from "../Context/ChatNovaContext";
import SocketContext from "../Context/SocketContext";
import UserSkeleton from "./UserSkeleton";
import UserItem from "./UserItem";

export default function Group() {
  const socketcontext=useContext(SocketContext)
  const {socket}=socketcontext
  const authcontext = useContext(AuthContext);
  const { isServer,user,setActivePage,setLoadingMessages,Me } = authcontext;
  const context = useContext(ChatNovaContext);
 
  const {
    chattedUsersList,
    setIsGroup,
    activeChat,
    capitalizeFirstLetter,
    getAllGroups,
    allGroup,
    isAllGroupLoading,
    setActiveChat,
   queryClient,
    getConversationId,
    serchGroup,
    setConversationId,
    conversationId,
    activeGroupChat,
    getGroupById,
    getmessages,
    setActiveGroupChat,
    setAllgroups,
    loadingGroups,
    setLoadingGroups
    
  } = context;
  const [filteredGroups,setFilteredGroups]=useState(allGroup)
  const [searchClick, setSearchClick] = useState(true);
  const onChangeHandler = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
    let groups = allGroup.filter((grp)=>grp.name.toString().includes(value.toString()))
  setFilteredGroups(groups)
    }
  };
 

  const handleGroupClick = async(element) => {
  
    if(!socket) return
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }

     
     socket.emit("join_group",element._id)
     socket.emit("mark_seen",{conversationId:element._id,userId:Me._id})
     setConversationId(element._id)
     setActiveGroupChat(true);
     setActiveChat(true);
      setIsGroup(true)
  };

  useEffect(()=>{
    if (!socket) return
    const groupHandler =(newGroup)=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== newGroup._id)
          return [newGroup,...filterd]
      })

     
    }
    socket.on("group_created",groupHandler)
   return ()=>{
    socket.off("group_created",groupHandler)
   }
  },[socket])
  useEffect(()=>{
    if (!socket) return
    const groupLeaveHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })

     
    }
    socket.on("group_leaved",groupLeaveHandler)
   return ()=>{
    socket.off("group_leaved",groupLeaveHandler)
   }
  },[socket])
  useEffect(()=>{
    if (!socket) return
    const addedHandler =({groupId,conversationToSend})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return [conversationId]
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [conversationToSend,...filterd]
      })

     
    }
    socket.on("added_to_group",addedHandler)
   return ()=>{
    socket.off("added_to_group",addedHandler)
   }
  },[socket])
  useEffect(()=>{
    if (!socket) return
    const removedHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })
     if(conversationId === groupId){
  
    queryClient.removeQueries({ queryKey: ['Group',conversationId] });
      setActivePage(2)
      setActiveGroupChat(false)
      setConversationId(null)
      activeChat(null)
     }
     
    }
    socket.on("removed_from_group",removedHandler)
   return ()=>{
    socket.off("removed_from_group",removedHandler)
   }
  },[socket])
  useEffect(()=>{
    if (!socket) return
    const groupDeleteHandler =({groupId})=>{
      queryClient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
        const filterd =oldData.filter((group)=>group._id !== groupId)
          return [...filterd]
      })
     if(conversationId === groupId){
  
    queryClient.removeQueries({ queryKey: ['Group',conversationId] });
      setActivePage(2)
      setActiveGroupChat(false)
      setConversationId(null)
      activeChat(false)
     }
     
    }
    socket.on("group_deleted",groupDeleteHandler)
   return ()=>{
    socket.off("group_deleted",groupDeleteHandler)
   }
  },[socket])


  

  const normalizeItem = (element,type)=>{
    
    const participant = element.participents.find(
  (p) => p.user.toString() === Me._id
);
console.log(participant?.unreadCount)
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
    
    
  }
const allNormailizedGroups=allGroup?.map((element)=>
  // console.log(element)
  normalizeItem(element,"chat")
)
const allNormailizedfilteredGroups=filteredGroups?.map((element)=>
  normalizeItem(element,"search")
)
  
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      <div className="h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-gradient-to-br from-indigo-50 to-purple-50 flex-col">
        <div className="flex justify-between">
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Groups</div>
          <div className="pt-2">
            {" "}
            <PlusIcon className="w-6 h-6 sha mx-2 text-blue-700 cursor-pointer"  onClick={()=>{setActivePage(5)}}/>
          </div>
        </div>

        <div className="flex p-2 pr-0 rounded-xl border-none mx-4 my-2  bg-white">
          <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
          <input
            type="search"
            className="w-full  outline-none pl-2"
            onChange={onChangeHandler}
            placeholder="Search messages or users"
            name="usersearch"
            id="usersearch"
          />
        </div>

        <div className="flex pt-2 flex-col mb-14 lg:mb-0 p-2 px-4 overflow-y-auto scrollbar-hide">
          {!searchClick &&
            allNormailizedfilteredGroups &&
            allNormailizedfilteredGroups.length !== 0 &&
            allNormailizedfilteredGroups.map((element) => {
              return (
          
              <UserItem key={element._id} user={element}  handleUserClick={handleGroupClick}></UserItem>
              );
            })}
          {!isAllGroupLoading ? searchClick && allNormailizedGroups && allNormailizedGroups.length !== 0 && (
            allNormailizedGroups.map((element) => {
              return ( 
                <div className="h-[72px]">
                 <UserItem key={element._id} user={element}  handleUserClick={handleGroupClick}></UserItem></div>
              );
            })
          ):[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
        </div>
      </div>
    </>
  );
}
