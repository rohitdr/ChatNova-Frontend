import { lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ChatNovaContext from "../Context/ChatNovaContext";
const Profile = lazy(()=>import('./Profile'))
const Settings = lazy(()=>import('./Settings'))
const GroupInfo = lazy(()=>import('./GroupInfo'))
const CreateGroup = lazy(()=>import('./CreateGroup'))
const Group = lazy(()=>import('./Group'))
import AuthContext from "../Context/AuthContext";
import SocketContext from "../Context/SocketContext";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import UserSkeleton from "./UserSkeleton";
import UserItem from "./UserItem"
import { Virtuoso } from "react-virtuoso";
import useDebounce from "./Hooks/Debouncer.jsx";

export default function Users() {
  const context = useContext(ChatNovaContext);
  const {
    searchUser,
    isSearchLoading,
  
    dataBaseUsers,
    getConversationId,
   
    
    setActiveChat,
  
  
    setCurrentChatUserId,
 
    setActiveGroupChat,
    conversationId,
    setConversationId,
  
    chattedUsersList,
    userListFetchNextPage,
    isUsersListLoading
  } = context;

  const [searchClick, setSearchClick] = useState(true);
  const authContext = useContext(AuthContext);
  const { activePage,Me } = authContext;
  const socketcontext = useContext(SocketContext);
  const {  socket } = socketcontext;
 
  const [searchValue,setSearchValue]=useState("")

 





  const onChangeHandler = (e) => {
    let value = e.target.value;
setSearchValue(value)
    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
    
    }
  };
 const debounceSearch = useDebounce(searchValue,400)
const lastValue = useRef("");

useEffect(() => {
  if (
    debounceSearch.trim().length > 2 &&
    debounceSearch !== lastValue.current
  ) {
    lastValue.current = debounceSearch;
    searchUser(debounceSearch);
  }
}, [debounceSearch, searchUser]);
  const handleUserClick =useCallback(async(element) => {
  
   if (!socket) return;

 if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
     socket.emit("join_group",element.ConversationId)
     socket.emit("mark_seen",{conversationId:element.ConversationId,userId:Me._id})

setActiveGroupChat(false);
setCurrentChatUserId(element.user._id);

setConversationId(element.ConversationId);
setActiveChat(true);



 

    
  },[socket,
  conversationId,Me?._id
  ]) 
  const handleDatabaseUserClick =useCallback(async(element) => {
  

    setActiveGroupChat(false);
  
      setCurrentChatUserId(element._id);
    setSearchClick(true);
    setActiveChat(true);

try {
  await getConversationId(element._id)
} catch (err) {
  console.error(err)
}

  },[
  getConversationId
  ]
) 



  const normalizeItem = useCallback((element,type)=>{
    if(type==="chat"){
         return{
          element,
          name:element.user?.name,
          image:element.user?.image?.url,
          lastMessage:element.lastMessage,
           _id:element.user._id,
           unreadCount:element.unreadCount
         }
         
        }
        if(type==="search"){
        return{
           element,
         name:element.name,
         image:element.image?.url,
         lastMessage:null,
         _id:element._id,
         unreadCount:element.unreadCount
        }
        }

  },[])

  const NormalizedChattedUsers=useMemo(()=>chattedUsersList?.map((element)=>
    normalizeItem(element,"chat")

  ),[chattedUsersList,normalizeItem])
  const NormalizedDatabaseUsers=useMemo(()=>dataBaseUsers?.map((element)=>
    normalizeItem(element,"search")
  ),[dataBaseUsers,normalizeItem])
  
  return (
    <>
     
        <div
          className={`h-screen ${activePage===0?"block":"hidden"}  xs:p-2  lg:p-0 flex bg-gradient-to-br from-indigo-50 to-purple-50 flex-col `}
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

          <div className={`flex pt-2 flex-col    lg:mb-0 sm:p-2 px-3 ${!searchClick && " overflow-y-auto scrollbar-hide "}  lg:px-4 h-full`}>
         { !isSearchLoading&&!searchClick && (
  <>
    {NormalizedDatabaseUsers?.length > 0 ? (
      NormalizedDatabaseUsers.map((element) => (
        <div key={element._id} style={{ height: 65 }} className="my-1">
          <UserItem
            user={element}
            handleUserClick={handleDatabaseUserClick}
          />
        </div>
      ))
    ) : (
      <div className="flex justify-center items-center h-full text-gray-500">
        No users found
      </div>
    )}
  </>
)}   
           
         
            {!isUsersListLoading && searchClick ?
            <div className="h-full">
            <Virtuoso
                className="scrollbar-hide "
                endReached={userListFetchNextPage}
                computeItemKey={(index, element) => element._id}
                // ref={virtuosoRef}
                overscan={200}
               
                defaultItemHeight={65}
                style={{ height: "100%"}}
              increaseViewportBy={{ top: 0, bottom: 400 }}
                data={NormalizedChattedUsers}
               followOutput={false}
            components={{Footer:()=><div  style={{ height: "70px"}}/>}}
                itemContent={(index, element) => (
                  <div style={{ height: 65 }}>
                
                   <UserItem user={element} key={element._id}  handleUserClick={handleUserClick} ></UserItem>

                 
       </div>
                )}
                
              
              />
             </div>
                
              : searchClick && !isUsersListLoading && (
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
            {(isUsersListLoading || isSearchLoading )&&[...Array(10)].map((_,i)=><UserSkeleton key ={i} send={i%2===0}></UserSkeleton>) }
          </div>
        </div>
      
    <Suspense fallback={null}>
  <div className={activePage === 1 ? "block h-full" : "hidden"}>
    <Profile />
  </div>

  <div className={activePage === 2 ? "block" : "hidden"}>
    <Group />
  </div>

  <div className={activePage === 3 ? "block h-full" : "hidden"}>
    <Settings />
  </div>

  <div className={activePage === 4 ? "block" : "hidden"}>
    <GroupInfo />
  </div>

  <div className={activePage === 5 ? "block" : "hidden"}>
    <CreateGroup />
  </div>
</Suspense>
    </>
  );
}
