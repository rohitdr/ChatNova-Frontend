import { useContext, useEffect, useState } from "react";
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
import { VideoCameraIcon, PhotoIcon } from "@heroicons/react/24/solid";
import CreateGroup from "./CreateGroup";
import UserSkeleton from "./UserSkeleton";
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
    setActiveGroupChat,
    conversationId,
    setConversationId,
    getmessages,

  } = context;

  const [searchClick, setSearchClick] = useState(true);
  const authContext = useContext(AuthContext);
  const { activePage, isServer, user, setLoadingMessages,loadingUser } = authContext;
  const socketcontext = useContext(SocketContext);
  const { onlineUsers, socket } = socketcontext;
  const [unseenMessages, setUnseenMessages] = useState(0);

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
  const handleUserClick = async(element) => {
    if (!socket || !user?._id) return;
    setLoadingMessages(true)
    if (conversationId) {
      socket.emit("leave_group", conversationId);
    }

    socket.emit("join_group", element.ConversationId);
    socket.emit("mark_seen", {
      conversationId: element.ConversationId,
      userId: user._id,
    });
 setCurrentUsersMessages([]),
 
      setHasMore(true),
      setpage(2),
         setActiveGroupChat(false);
   
      setCurrentChatUserId(element.user._id);
    setActiveChat(true);
    setConversationId(element.ConversationId)
    try{
 await getmessages(element.ConversationId);
    await getCureentChattingUser(element.user._id);
    }catch(err){
      console.log(err)
    }
   setTimeout(()=>{
 setLoadingMessages(false)
   },500)

      isInitailLoadRef.current = true;
  };
  const handleDatabaseUserClick = async(element) => {
     if (!socket || !user?._id) return;
    setLoadingMessages(true)
  
  
    setActiveGroupChat(false);
    setCurrentUsersMessages([]),
      setHasMore(true),
      setpage(2),
      setCurrentChatUserId(element._id);
    setSearchClick(true);
    setActiveChat(true);
     try{
 await getConversationId(element._id);
    await getCureentChattingUser(element._id);
    }catch(err){
      console.log(err)
    }
     setTimeout(()=>{
 setLoadingMessages(false)
   },500)
  
   
      isInitailLoadRef.current = true;
  };

  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      {activePage === 0 && (
        <div
          className={`h-screen   xs:p-4  lg:p-0 flex bg-[#F5F7FB] flex-col `}
        >
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

          <div className="flex pt-2 flex-col pb-10 mb-10 lg:mb-0  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
            {!searchClick &&
              dataBaseUsers &&
              dataBaseUsers.length !== 0 &&
              dataBaseUsers.map((element) => {
                return (
                  <div
                    key={element._id}
                    onClick={() => {
                      handleDatabaseUserClick(element);
                    }}
                    className="flex shadow cursor-pointer bg-white rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5] p-0 lg:p-2"
                  >
                    <div className="pt-2">
                      <img
                        loading="lazy"
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
            {!loadingUser ?searchClick && chattedUsersList && chattedUsersList.length !== 0
              ? chattedUsersList.map((element) => {
                  return (
                    <div
                      key={element.user._id}
                      onClick={() => {
                        handleUserClick(element);
                      }}
                      className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2 bg-white  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                    >
                      <div className="">
                        <img
                          loading="lazy"
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
                                  element.lastMessage.createdAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                          </p>
                        </div>
                        <div className="pl-2  text-[10px] xs:text-sm text-gray-400 flex justify-between">
                          {element.lastMessage.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              : searchClick && (
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
                ):
            [...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
          </div>
        </div>
      )}
      {activePage === 1 && <Profile></Profile>}
      {activePage === 2 && <Group></Group>}
      {activePage === 3 && <Settings></Settings>}
      {activePage === 4 && <GroupInfo></GroupInfo>}
      {activePage === 5 && <CreateGroup></CreateGroup>}
    </>
  );
}
