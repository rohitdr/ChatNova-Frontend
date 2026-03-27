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

export default function Group() {
  const socketcontext=useContext(SocketContext)
  const {socket}=socketcontext
  const authcontext = useContext(AuthContext);
  const { isServer,user,setActivePage,setLoadingMessages } = authcontext;
  const context = useContext(ChatNovaContext);
 
  const {
    chattedUsersList,
    capitalizeFirstLetter,
    getAllGroups,
    allGroups,
    setActiveChat,
   
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
  const [filteredGroups,setFilteredGroups]=useState(allGroups)
  const [searchClick, setSearchClick] = useState(true);
  const onChangeHandler = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
    let groups = allGroups.filter((grp)=>grp.name.toString().includes(value.toString()))
  setFilteredGroups(groups)
    }
  };
  useEffect(() => {
    getAllGroups();
  }, []);

  const handleGroupClick = async(element) => {
    if(!socket) return
    setLoadingMessages(true)
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
     
     socket.emit("join_group",element._id)
     socket.emit("mark_seen",{conversationId:element.ConversationId,userId:user._id})
   setConversationId(element._id)
    setActiveChat(true);
    setActiveGroupChat(true);
    try{

    await  getGroupById(element._id);
    await  getmessages(element._id);
    }catch(error){
      console.log(error)
    }
    setTimeout(() => {
      setLoadingMessages(false)
    }, 500);

  };
  useEffect(()=>{
    if (!socket) return
    const groupHandler =(newGroup)=>{
   
      setAllgroups(prev=>{
        const filterd =prev.filter((group)=>group._id !== newGroup._id)
        return [newGroup,...filterd]
      }
      )
     
    }
    socket.on("group_created",groupHandler)
   return ()=>{
    socket.off("group_created",groupHandler)
   }
  },[socket])
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      <div className="h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-[#F5F7FB] flex-col">
        <div className="flex justify-between">
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Groups</div>
          <div className="pt-2">
            {" "}
            <PlusIcon className="w-6 h-6 sha mx-2 text-blue-700 cursor-pointer"  onClick={()=>{setActivePage(5)}}/>
          </div>
        </div>

        <div className="flex p-2 pr-0 rounded-xl border-none mx-2 sm:mx-4 my-2  bg-white">
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

        <div className="flex pt-2 flex-col  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
          {!searchClick &&
            filteredGroups &&
            filteredGroups.length !== 0 &&
            filteredGroups.map((element) => {
              return (
                 <div
                  onClick={()=>{handleGroupClick(element)}}
                  key={element._id}
                  className="flex shadow  border-2  bg-white cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                >
                  <div className="pt-2">
                    <img
                    loading="lazy"
                      className="w-12 h-10 rounded-full border-white border-2"
                      src={element.avtar.url}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col w-full justify-between py-1">
                    <div className="flex  flex-1 justify-between items-center pl-2 ">
                      <p className="font-small text-xs  xs:text-sm text-black">
                        {capitalizeFirstLetter(element.name)}
                      </p>
                      <p className=" pt-1 text-[10px] xs:text-xs text-gray-400">
                        {element.lastMessageTime === null
                          ? ""
                          : new Date(
                              element.lastMessage.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </p>
                    </div>
                    <div className="pl-2  text-[10px] xs:text-sm text-gray-400">
                      {element.lastMessage.text}
                    </div>
                  </div>
                </div>
              );
            })}
          {!loadingGroups ? searchClick && allGroups && allGroups.length !== 0 ? (
            allGroups.map((element) => {
              return (
                <div
                  onClick={()=>{handleGroupClick(element)}}
                  key={element._id}
                  className="flex shadow-lg  border-2 hover:shadow-xl bg-white cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                >
                  <div className="pt-2">
                    <img
                    loading="lazy"
                      className="w-10 h-10 object-cover shadow rounded-full border-white border-2"
                      src={element.avtar.url}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col w-full justify-between py-1">
                    <div className="flex  flex-1 justify-between items-center pl-2 ">
                      <p className="font-small text-xs  xs:text-sm text-black">
                        {capitalizeFirstLetter(element.name)}
                      </p>
                      <p className=" pt-1 text-[10px] xs:text-xs text-gray-400">
                        {element.lastMessageTime === null
                          ? ""
                          : new Date(
                              element.lastMessage.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </p>
                    </div>
                    <div className="pl-2  text-[10px] xs:text-sm text-gray-400">
                      {element.lastMessage.text}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-screen justify-center items-center">
              <div className="text-center flex flex-col">
                {" "}
                <div className="flex justify-center">
                  {" "}
                  <MagnifyingGlassCircleIcon className="h-12 w-12 text-gray-600"></MagnifyingGlassCircleIcon>
                </div>
                <div>Search User to chat With...</div>{" "}
              </div>
            </div>
          ):[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
        </div>
      </div>
    </>
  );
}
