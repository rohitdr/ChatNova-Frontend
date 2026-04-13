import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ChatNovaContext from "./ChatNovaContext";




import AuthContext from "./AuthContext.jsx";
import SocketContext from "./SocketContext.jsx";
import { useQueryClient } from "@tanstack/react-query";
import useUsers from "../Components/Hooks/useUsers.jsx";
import useSelectedUser from "../Components/Hooks/useSelectedUser.jsx";
import useSelectedGroup from "../Components/Hooks/useSelectedGroup.jsx";
import useGroups from "../Components/Hooks/useGroups.jsx";
import {  getAllGroupsApi, getConversationIdApi, getGroupByIdApi, uploadGroupImageApi } from "../Api/GroupApi.jsx";
import { chattedUsersApi, getCurrentChattingUserApi, searchUserApi } from "../Api/UsersApi.jsx";
import { useSendMessage } from "../Components/Hooks/UseSendMessage.jsx";
import { getMessagesApi, sendMediaApi, uploadCloudinaryApi } from "../Api/MessageApi.jsx";
import { useGroupMutation } from "../Components/Hooks/UseGroupMutation.jsx";

export default function ChatNovaState(props) {

  const { setProgress,Me,setActivePage,handleError } =  useContext(AuthContext);
const {socket} =useContext(SocketContext) 
  const [dataBaseUsers, setDataBaseUsers] = useState(null);
 

  const [currentChatUserId, setCurrentChatUserId] = useState(null);

  
  const [activeChat, setActiveChat] = useState(false);
const [conversationId,setConversationId]=useState(null)
const [isSearchLoading,setIsSearchLoading]=useState(false)
  const [page,setpage]=useState(2)

  const [activeGroupChat,setActiveGroupChat]=useState(false)
  const [currentGroup,setCurrentGroup]=useState(null)
 const hasMoreRef = useRef(true)
 const loadingRef = useRef(false)
const isInitailLoadRef = useRef(true)
const [loadingGroups,setLoadingGroups]=useState(false)
const [hasMoreUsers , setHasMoreUsers]=useState(true)
const firstItemIndexRef =useRef(10000000)
const [currentUserLoading,setCurrentUserLoading]=useState(false)
 const [isAdmin,setIsAdmin]=useState(false)
 const [replyMessage,setReplyMessage]=useState(null)
 const [isGroup,setIsGroup]=useState(false)
 const sendMessageMutation = useSendMessage(handleError);
useEffect(() => {
setIsGroup(false)
setIsAdmin(false)
  setDataBaseUsers(null)

setIsSearchLoading(false)
  setCurrentChatUserId(null)


  setActiveChat(false)
  setConversationId(null)

  setpage(2)

  setActiveGroupChat(false)
  setCurrentGroup(null)
  setLoadingGroups(false)
  setHasMoreUsers(true)
  setCurrentUserLoading(false)

  // reset refs too
  hasMoreRef.current = true
  loadingRef.current = false
  isInitailLoadRef.current = true
  firstItemIndexRef.current = 10000000

}, [Me?.id])

 const {addMemberMutation,
        createGroupMutation,
        leaveGroupMutation,
        deleteGroupMutation,
        removeMemberMutation} =useGroupMutation(handleError)
       const isLeavingGroup = leaveGroupMutation.isPending;
       const isDeletingGroup = deleteGroupMutation.isPending;
  const queryClient = useQueryClient()
    useEffect(()=>{
 setReplyMessage(null)
  },[conversationId])

  const runWithProgress =(mutation,data,onSuccess)=>{
    mutation.mutate(data,
     {
    onMutate: () => {
      setProgress(30);
      setTimeout(() => {
        setProgress(50);
      },200 );
      setTimeout(() => {
        setProgress(70);
      }, 400);
    },
    onSuccess: () => {
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 300);
      onSuccess?.();
    },
    onError: () => setProgress(0)
  });
    
  }
  /// function to get User whom with logged in user has chats

  /// function to get the coversation id between the current chatter and logged in user
  const getConversationId = async (id) => {
    try {
      const res = await getConversationIdApi(id)
      if (res.status === 200) {
          
     if(!socket) return
    
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
    
     socket.emit("join_group",res.data.conversation._id)
 
             setConversationId(res.data.conversation._id)
       
      }
    } catch (error) {
     handleError(error)
    
    }
  };
  // function to search users from database to chat with search query
  const searchUser =useCallback(async (searchValue) => {
    try {
      setIsSearchLoading(true)
      const res = await searchUserApi(searchValue)
      if (res.status === 200) {
        setDataBaseUsers(res.data.users);
        setTimeout(() => {
           setIsSearchLoading(false)
        }, 1000);
    
      }
    } catch (error) {

handleError(error)
        setTimeout(() => {
           setIsSearchLoading(false)
        }, 1000);
    
      
    }
  },[])

  //function to serach the users with whom logged in user have chatted
  const chattedUsers = async (page) => {
    try {
     let limit =15
      const res =await chattedUsersApi(limit,page)
      if (res.status === 200) {
    
     
         return  {
  users: res.data.users,
  page: page,
  hasMore: res.data.hasMore
}

      }
    } catch (error) {
      handleError(error)
      throw  error
    }
  };
 

  // function to get current chatting user
  const getCurrentChattingUser = async (id) => {
    try {
   
      const res = await getCurrentChattingUserApi(id)
  

    return  res.data.user
    
    
    } catch (error) {
      handleError(error)
   throw error
    }
  };

  const getmessages = async (id,cursor) => {
    try {
   
      const res = await getMessagesApi(id,cursor)
      if (res.status === 200) {
      
        return  {
  message: res.data.message,
  nextCursor:res.data.nextCursor
};
      }
    } catch (error) {
      handleError(error)
     throw error; 
    }
  };





const {data:usersList,isLoading:isUsersListLoading,fetchNextPage:userListFetchNextPage}=useUsers(chattedUsers,Me)
const chattedUsersList = usersList?.pages.flatMap(page => page.users) || [];

   const {data:selectedUser,isLoading:selectedUserLoading}=useSelectedUser(currentChatUserId,getCurrentChattingUser);

//sendmessagee do it 
  const sendMessages = async (message) => {
   sendMessageMutation.mutate(message)
  };


  const sendMedia = async (id, message) => {
    try {
      await sendMediaApi(id,message)
    } catch (error) {
     handleError(error)
    }
  };

  //function to upload a image or video or file
  const uploadCloudinary = async (id, file,tempId) => {
    try {
      setProgress(10);
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata)
      setProgress(30);
   
      const message = {
        publicId: res.data.public_id,

        bytes: res.data.bytes,
        type: res.data.resource_type,
        url: res.data.secure_url,
        tempId:tempId
      };
   
    
      setProgress(60);
      sendMedia(id, message);
      setProgress(100);
    } catch (error) {
   handleError(error)
      setProgress(100);
    }
  };
  /// function to get all groups
  const getAllGroups =async()=>{
 try {

      const res = await getAllGroupsApi()
   
   return res.data.groups
    } catch (error) {
  
     handleError(error)
      throw error
    }
  }

  //function to get group by id
  const getGroupById=async(id)=>{
     try {
      const res = await getGroupByIdApi(id)
 const isAdminUser = res.data.group.participents?.some(
  (p) => p.user._id === Me._id && p.role === "admin"
);
setIsAdmin(isAdminUser);

return res.data.group

    } catch (error) {
     handleError(error)
      throw error
    
    }
  }
 
 const {data:selectedGroup, isLoading:selectedGroupLoading}=useSelectedGroup(conversationId,isGroup,getGroupById)
 

const {data:allGroup,isLoading:isAllGroupLoading}=useGroups(getAllGroups,Me)
    const updateGroupImage = async (file) => {
    try {
        setProgress(30);
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata)
        setProgress(60);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
       
      }; 
      await uploadGroupImageApi(image,conversationId)
  
    
        setProgress(100);
    } catch (error) {
     handleError(error)
    }
  };
//// function to add member from group
const addMember =(userId)=>{
    
      const data = {
       groupId:conversationId,
       participents:[{
        user:userId,
        role:"member"
       }]
      }  
      runWithProgress(addMemberMutation,data)
   

    
}
//// function to remove member from group
const removeMember =(userId,tempId)=>{

   
      const data = {
       groupId:conversationId,
       participents:[{
        user:userId,
       }],
       tempId
      }
     runWithProgress(removeMemberMutation,data)
    
    
  
}
const leaveGroup =()=>{
  if(isLeavingGroup) return
      const data = {
       groupId:conversationId,
      }
     runWithProgress(leaveGroupMutation,data,() => {
      setActiveGroupChat(false);
      setConversationId(null);
      setActivePage(2);
    })
 
  
  
}
const deleteGroup =()=>{
  if(isDeletingGroup) return
      const data = {
       groupId:conversationId,
      }
   runWithProgress(deleteGroupMutation,data,()=>{  setActiveGroupChat(false);
    setConversationId(null)
    setActivePage(2)})
  
  
  
}
const createGroup =async(participents,name,inviteCode,file)=>{
    try {
   
         setProgress(10);
        const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await uploadCloudinaryApi(formdata)
        setProgress(40);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
       
      };
      let data = {
       participents,
       name,
       avtar:image,
       inviteCode

      }
       setProgress(70);
    createGroupMutation.mutate(data,{onSuccess:()=>{ setActivePage(2)}})
    
         setProgress(100);
    } catch (error) {
    handleError(error)
    
    }
}


  const capitalizeFirstLetter = (string) => {
    // Check if the input is a non-empty string to avoid errors
    if (typeof string !== "string" || string.length === 0) {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <ChatNovaContext.Provider
      value={{
        isDeletingGroup,
        getGroupById,
        useSelectedGroup,
        createGroup,
        removeMember,
        setCurrentGroup,
        currentGroup,
        activeGroupChat,
        setActiveGroupChat,
        getAllGroups,
     currentUserLoading,
        page,
        replyMessage,
        allGroup,
        setReplyMessage,
   
     selectedUser,
     selectedUserLoading,

        isAllGroupLoading,
   updateGroupImage,
        conversationId,
    addMember,
    isSearchLoading,
    deleteGroup,
    firstItemIndexRef,
        activeChat,
        setActiveChat,
        uploadCloudinary,
        capitalizeFirstLetter,
        searchUser,
        sendMessages,
        setConversationId,
        dataBaseUsers,
     isGroup,setIsGroup,
        getmessages,
      isInitailLoadRef,
      
      getConversationId,
      setpage,
      isLeavingGroup,
        getCurrentChattingUser,
        setDataBaseUsers,
        setCurrentChatUserId,
        currentChatUserId,
     userListFetchNextPage,
     isUsersListLoading,
        chattedUsersList,
        hasMoreUsers,
        chattedUsers,
        queryClient,
    
        isAdmin,
    leaveGroup,
        loadingGroups,selectedGroup,
        selectedGroupLoading
      }}
    >
      {props.children}
    </ChatNovaContext.Provider>
  );
}
