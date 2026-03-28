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
import UserItem from "./UserItem"
import { Virtuoso } from "react-virtuoso";
export default function Users() {
  const context = useContext(ChatNovaContext);
  const {
    serchUser,
    loadMoreChattedUsers,
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
    hasMoreUsers

  } = context;

  const [searchClick, setSearchClick] = useState(true);
  const authContext = useContext(AuthContext);
  const { activePage, isServer, user, setLoadingMessages,loadingUser } = authContext;
  const socketcontext = useContext(SocketContext);
  const { onlineUsers, socket } = socketcontext;
  const [unseenMessages, setUnseenMessages] = useState(0);
  const [userListpage,setUserListPage]=useState(1)
  const [isFetching, setIsFetching] = useState(false);
  const [searchValue,setSearchValue]=useState("")

  useEffect(() => {
    chattedUsers(userListpage,15);
  }, []);

  useEffect(() => {}, [activePage]);

  const onChangeHandler = (e) => {
    let value = e.target.value;
setSearchValue(value)
    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
    
    }
  };

useEffect(() => {
  const delay = setTimeout(() => {
    if (searchValue.trim().length > 2) {
      serchUser(searchValue);
    }
  }, 400); 

  return () => clearTimeout(delay); 
}, [searchValue]);
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

  const virtusoEndReached = async() => {
    if (!hasMoreUsers || isFetching) return;
   setIsFetching(true)
  await loadMoreChattedUsers(userListpage + 1, 15);

  setUserListPage(prev => prev + 1);

  
 setIsFetching(false)
    
  };

  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      {activePage === 0 && (
        <div
          className={`h-screen   xs:p-2  lg:p-0 flex bg-[#F5F7FB] flex-col `}
        >
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Chats</div>
          <div className="flex p-2  pr-0 rounded-xl border-none mx-3 sm:mx-4 my-2 bg-white shadow">
            <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
            <input
              type="search"
              className="w-full  bg-white  outline-none pl-2"
              onChange={onChangeHandler}
              placeholder="Search messages or users"
              name="usersearch"
              id="usersearch"
            />
          </div>

          <div className={`flex pt-2 flex-col pb-10 mb-10 lg:mb-0 sm:p-2 px-3 ${!searchClick && " overflow-y-auto scrollbar-hide "} lg:px-4 h-full`}>
            {!searchClick &&
              dataBaseUsers &&
              dataBaseUsers.length !== 0 &&
              dataBaseUsers.map((element) => {
                return (
               
                      <div key ={element._id }style={{ height: 65 }} className="my-1" >
               <UserItem element={element} image={element.image.url} name={element.name} lastMessage={null}  handleUserClick={()=>{handleDatabaseUserClick(element)}} capitalizeFirstLetter={capitalizeFirstLetter}></UserItem>
       </div>
                );
              })}
            
            {!loadingUser && searchClick ?
            <div className="h-full">
            <Virtuoso
                className="scrollbar-hide"
                endReached={virtusoEndReached}
                computeItemKey={(index, element) => element.ConversationId}
                // ref={virtuosoRef}
                overscan={200}
               
                defaultItemHeight={65}
                style={{ height: "100%" }}
              increaseViewportBy={{ top: 0, bottom: 400 }}
                data={chattedUsersList}
               followOutput={false}
                itemContent={(index, element) => (
                  <div style={{ height: 65 }}>
               <UserItem element={element} image={element.user.image.url} name={element.user.name} lastMessage={element.lastMessage} handleUserClick={()=>{handleUserClick(element)}} capitalizeFirstLetter={capitalizeFirstLetter}></UserItem>
       </div>
                )}
              
              />
             </div>
                
              : searchClick && !loadingUser && (
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
            {loadingUser &&[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
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
