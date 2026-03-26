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

export default function Group() {
  const socketcontext=useContext(SocketContext)
  const {socket}=socketcontext
  const authcontext = useContext(AuthContext);
  const { isServer,user,setActivePage } = authcontext;
  const context = useContext(ChatNovaContext);
  const {
    chattedUsersList,
    capitalizeFirstLetter,
    getAllGroups,
    allGroups,
    setActiveChat,
    databaseGruops,
    getConversationId,
    serchGroup,
    setConversationId,
    conversationId,
    activeGroupChat,
    getGroupById,
    getmessages,
    setActiveGroupChat
    
  } = context;
  const [searchClick, setSearchClick] = useState(true);
  const onChangeHandler = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
      serchGroup(value);
    }
  };
  useEffect(() => {
    getAllGroups();
  }, []);

  const handleGroupClick = (element) => {
    if(!socket) return
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
     
     socket.emit("join_group",element._id)
     socket.emit("mark_seen",{conversationId:element.ConversationId,userId:user._id})
   setConversationId(element._id)
    setActiveChat(true);
    setActiveGroupChat(true);
    getGroupById(element._id);
    getmessages(element._id);

  };
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

        <div className="flex p-2 pr-0 rounded-lg border-none mx-2 sm:mx-4 my-2 bg-[#E6EBF5]">
          <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
          <input
            type="search"
            className="w-full  bg-[#E6EBF5] outline-none pl-2"
            onChange={onChangeHandler}
            placeholder="Search messages or users"
            name="usersearch"
            id="usersearch"
          />
        </div>

        <div className="flex pt-2 flex-col  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
          {!searchClick &&
            databaseGruops &&
            databaseGruops.length !== 0 &&
            databaseGruops.map((element) => {
              return (
                <div
                  key={element._id}
                 onClick={handleGroupClick}
                  className="flex shadow cursor-pointer bg-white rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5] p-0 lg:p-2"
                >
                  <div className="pt-2">
                    <img
                      className="w-12 h-10 rounded-full border-white border-2"
                      src={element.avtar.url}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col w-full justify-between py-1">
                    <div className="flex  flex-1 justify-between items-center pl-2 ">
                      <p className="font-small text-black">
                        {capitalizeFirstLetter(element.name)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          {searchClick && allGroups && allGroups.length !== 0 ? (
            allGroups.map((element) => {
              return (
                <div
                  onClick={()=>{handleGroupClick(element)}}
                  key={element._id}
                  className="flex shadow  border-2  bg-white cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                >
                  <div className="pt-2">
                    <img
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
          )}
        </div>
      </div>
    </>
  );
}
