import  { useContext, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ChatNovaContext from "../Context/ChatNovaContext";
import Profile from "./Profile";
import AuthContext from "../Context/AuthContext";
import Settings from "./Settings";
import Group from "./Group";
import SocketContext from "../Context/SocketContext";
import NoServer from "./NoServer";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import GroupInfo from "./GroupInfo";
import {

  VideoCameraIcon,
  PhotoIcon,

} from "@heroicons/react/24/solid";
export default function Users() {
  const context = useContext(ChatNovaContext);
  const {
    serchUser,
    dataBaseUsers,
    getConversationId,
    currentUsersMessages,
    setChattedUsersList,
    setActiveChat,
    activeChat,
    getCureentChattingUser,
    chattedOnlineUsers,
 setCurrentUsersMessages,
    isInitailLoadRef,
      setHasMore,
      setpage,
    chattedUsersList,
    chattedUsers,
    currentChatUserId,
    setCurrentChatUserId,
    capitalizeFirstLetter,
    setActiveGroupChat
  } = context;
  const [searchClick, setSearchClick] = useState(true);
  const authContext = useContext(AuthContext);
  const { activePage, isServer } = authContext;
  const socketcontext = useContext(SocketContext);
  const { onlineUsers } = socketcontext;
  const [unseenMessages,setUnseenMessages]=useState(0)

  useEffect(() => {
    chattedUsers();

  }, []);



  useEffect(() => {}, [activePage]);

  const onChangeHandler = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
      serchUser(value);
    }
  };
  
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      {activePage === 0 && (
        <div className={`h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-[#F5F7FB] flex-col `}>
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Chats</div>
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
          {/* online users  */}
          {/* {searchClick && (
            <div className="flex  justify-evenly overflow-x-auto overflow-y-hidden scrollbar-hide">
              {searchClick &&
                chattedOnlineUsers &&
                chattedOnlineUsers.length !== 0 &&
                chattedOnlineUsers.map((element) => {
                  return (
                    <div
                      onClick={() => {
                        setCurrentChatUserId(element._id);
                        getCureentChattingUser(element._id);
                        setActiveChat(true);
                        getConversationId(element._id);
                      }}
                      className={`p-2 pb-0  cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5]  mx-1`}
                    >
                      <div className="relative">
                        {onlineUsers?.includes(element?._id) && (
                          <div className="absolute h-2 w-2 bottom-0 right-0 rounded-full  bg-green-400"></div>
                        )}
                        <img
                          className="w-12  h-12 rounded-full border-white border-2"
                          src={element.image.url}
                          alt=""
                        />
                      </div>
                      <div className="flex justify-center">
                        <p className="text-xs   ">
                          {" "}
                          {capitalizeFirstLetter(element.name).substring(0, 5)}
                          ...
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )} */}

          <div className="flex pt-2 flex-col  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
            {!searchClick &&
              dataBaseUsers &&
              dataBaseUsers.length !== 0 &&
              dataBaseUsers.map((element) => {
                return (
                  <div
                  key={element._id}
                    onClick={() => {
                      setActiveGroupChat(false)
                          setCurrentUsersMessages([]),
                           setHasMore(true),
                             setpage(2),
                      setCurrentChatUserId(element._id);
                      getCureentChattingUser(element._id);
                      setActiveChat(true);
                      getConversationId(element._id);
                    }}
                    className="flex shadow cursor-pointer rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5] p-0 lg:p-2"
                  >
                    <div className="pt-2">
                      <img
                        className="w-12 h-10 rounded-full border-white border-2"
                        src={element.image.url}
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
            {searchClick &&
              chattedUsersList &&
              chattedUsersList.length !== 0 ?
              chattedUsersList.map((element) => {
             
                return (
                  <div
                  key={element.user._id}
                    onClick={() => {
                      isInitailLoadRef.current=true
                       setActiveGroupChat(false)
                      setCurrentUsersMessages([]),
      setHasMore(true),
      setpage(2),
                      setCurrentChatUserId(element.user._id);
                      
                      getCureentChattingUser(element.user._id);
                    
                      setActiveChat(true);
                      getConversationId(element.user._id);
                    }}
                    className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                  >
                    
                    <div className="">
                       
                        <img
                          className="w-12 mt-1 h-10 rounded-full border-white border-2"
                          src={element.user.image.url}
                          alt=""
                        />
                      </div>
                    <div className="flex flex-col w-full justify-between py-1">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-black">
                          {capitalizeFirstLetter(element.user.name)}
                        </p>
                    
                        <p className=" pt-1 text-[10px] xs:text-xs text-gray-400">
                          {element.lastMessage.createdAt === null
                            ? ""
                            : new Date(
                                element.lastMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </p>
                       
                      </div>
                      <div className="pl-2  text-[10px] xs:text-sm text-gray-400 flex justify-between">
                        {element.lastMessage.text}
                        {/* {element.lastMessageType =="image"&&  <div className="flex"> <PhotoIcon className="w-3 h-3 text-red-400 mt-1 mr-2 "></PhotoIcon> Photo</div>}
                        {element.lastMessageType =="video"&& <div className="flex"> <VideoCameraIcon className="text-[#6159CB] w-3 h-3 mt-1 mr-2"></VideoCameraIcon>Video</div>}
                        { element.lastMessageType=="text" && element.lastMessage === null
                          ? ""
                          : element.lastMessage} */}
                          {/* {unseenMessages===0?"":
                             <p className=" rounded-full bg-green-400 py-[1px] mx-2  px-[8px] text-black  text-[8px] ">
                       { unseenMessages}
                        </p>} */}
                      </div>
                    </div>
                  </div>
                );
              }):
              <div className="flex h-screen justify-center items-center">
                <div className="text-center flex flex-col"> <div className="flex justify-center"> <MagnifyingGlassCircleIcon className="h-12 w-12 text-gray-600"></MagnifyingGlassCircleIcon></div><div>Search User to chat With...</div> </div>
              </div>
              
              }
          </div>
        </div>
      )}
      {activePage === 1 && <Profile></Profile>}
      {activePage === 2 && <Group></Group>}
      {activePage === 3 && <Settings></Settings>}
      {activePage === 4 && <GroupInfo></GroupInfo>}
    </>
  );
}
