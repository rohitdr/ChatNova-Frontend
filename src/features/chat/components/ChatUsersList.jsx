
import {

  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import SocketContext from "../../../Context/SocketContext.jsx";

import UserSkeleton from "../../users/components/UserSkeleton.jsx";

import UserItem from '../../users/components/UserItem.jsx';

import useDebounce from "../../../Components/Hooks/Debouncer.jsx";
import { Virtuoso } from "react-virtuoso";
import EmptyChat from "../../../Components/EmptyChat.jsx";
import { useMe } from "../../users/hooks/UseMe.jsx";
import { NavLink, useParams } from 'react-router-dom';
import useChatUsers from '../hooks/useChatUsers.jsx';
import { useSearchUsers } from '../hooks/useSearchUsers.jsx';
import { normalizeItem } from '../utils/normalizeUsers.jsx';
import ChatSearchResults from "./ChatSearchResults.jsx";
import ChatList from "./ChatList.jsx";

export default function ChatUsersList() {
const {data,isLoading:isUsersListLoading,fetchNextPage:userListFetchNextPage}=useChatUsers()
  const chattedUsersList = data?.pages.flatMap(page => page.users) || [];
  const {conversationId}=useParams()
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  

    const {data:Me}=useMe()

  const socketcontext = useContext(SocketContext);
  const { socket } = socketcontext;

  const onChangeHandler = (e) => {
    let value = e.target.value;
    setSearchValue(value);

    if (value.length === 0) {
      setSearching(false);
    } else {
      setSearching(true);
    }
  };
  const debounceSearch = useDebounce(searchValue, 400);
    const {data:dataBaseUsers,isLoading:isSearchLoading}=useSearchUsers(debounceSearch)

  const handleUserClick = useCallback(  (element) => {
      if (!socket) return;
      if (conversationId) {
        socket.emit("leave_group", conversationId);
      }

      socket.emit("join_group", element.ConversationId);

      socket.emit("mark_seen", {
        conversationId: element.ConversationId,
        userId: Me?._id
      })
   
    },
    [socket, conversationId, Me?._id]
  );

  const handleDatabaseUserClick =  () => {
      setSearching(false);
    }

  const NormalizedChattedUsers = useMemo(
    () => chattedUsersList?.map((e) => normalizeItem(e, "chat")),
    [chattedUsersList]
  );

  const NormalizedDatabaseUsers = useMemo(
    () => dataBaseUsers?.map((e) => normalizeItem(e, "search")),
    [dataBaseUsers]
  );

  return (
     <div
        className={`h-screen 
          "block" 
        xs:p-2 lg:p-0 flex bg-gradient-to-br from-indigo-50 to-purple-50 flex-col `}
      >
        <div className="m-2 p-2 xs:p-0 text-3xl font-medium">
          Chats
        </div>

        <div className="flex p-2 pr-0 rounded-xl border-none mx-3 sm:mx-4 my-2 bg-white shadow-xl">
          <MagnifyingGlassIcon className="w-5 h-5 pt-1 text-gray-700 cursor-pointer" />

          <input
            type="search"
            className="w-full bg-white outline-none pl-2"
            onChange={onChangeHandler}
            placeholder="Search messages or users"
            name="usersearch"
            id="usersearch"
          />
        </div>

        <div
          className={`flex pt-2 flex-col ${
            searching && "overflow-y-auto scrollbar-hide"
          } lg:mb-0 sm:p-2 px-3 lg:px-4 h-full`}
        >
             {NormalizedChattedUsers?.length===0  && !isSearchLoading && !searching && <div className="h-full">
           <EmptyChat mode="users"></EmptyChat></div>
          
           }
    { searching?<ChatSearchResults users={NormalizedDatabaseUsers} searching={searching} isSearchLoading={isSearchLoading} hanldeclick={handleDatabaseUserClick}></ChatSearchResults>
       
      :<ChatList handleClick={handleUserClick} users={NormalizedChattedUsers} handleEndReach={userListFetchNextPage} isloading={isUsersListLoading}></ChatList>}

          {(isUsersListLoading || isSearchLoading) &&
            [...Array(10)].map((_, i) => (
              <UserSkeleton key={i} send={i % 2 === 0} />
            ))}
        </div>
  
      </div> 
  )
}
