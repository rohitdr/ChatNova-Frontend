import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ChatNovaContext from "./ChatNovaContext";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../Api/Axios.jsx";
import AuthContext from "./AuthContext.jsx";
import SocketContext from "./SocketContext.jsx";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ChatNovaState(props) {
  const authContext = useContext(AuthContext);
  const { setProgress,setIsServer,showAlert,setLoadingUser,Me,setActivePage } = authContext;
const {socket} =useContext(SocketContext) 
  const [dataBaseUsers, setDataBaseUsers] = useState(null);


  const [currentChatUserId, setCurrentChatUserId] = useState(null);

  
  const [activeChat, setActiveChat] = useState(false);
const [conversationId,setConversationId]=useState(null)
const [isSearchLoading,setIsSearchLoading]=useState(false)
  const [page,setpage]=useState(2)
  const [hasMore,setHasMore]=useState(true)
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
useEffect(() => {
setIsGroup(false)
setIsAdmin(false)
  setDataBaseUsers(null)

setIsSearchLoading(false)
  setCurrentChatUserId(null)


  setActiveChat(false)
  setConversationId(null)

  setpage(2)
  setHasMore(true)
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
 let Navigate = useNavigate()

  const queryClient = useQueryClient()

  /// function to get User whom with logged in user has chats

  /// function to get the coversation id between the current chatter and logged in user
  const getConversationId = async (id) => {
    try {
   
      const res = await api.get(`/messages/conversationId/${id}`);
      if (res.status === 200) {
          
     if(!socket) return
    
    if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
    
     socket.emit("join_group",res.data.conversation._id)
 
             setConversationId(res.data.conversation._id)
       
      }
    } catch (error) {
      const status = error.response?.status;
    if(status ===500){
    
      setIsServer(500)
      }
    
    }
  };
  // function to search users from database to chat with search query
  const searchUser =useCallback(async (searchValue) => {
    try {
      setIsSearchLoading(true)
      const res = await api.get(`/users/search?search=${searchValue}`);
      if (res.status === 200) {
        setDataBaseUsers(res.data.users);
        setTimeout(() => {
           setIsSearchLoading(false)
        }, 1000);
    
      }
    } catch (error) {
     const status = error.response?.status;

      if (status === 500) {
         setIsServer(500)
      
   
      }
        setTimeout(() => {
           setIsSearchLoading(false)
        }, 1000);
    
      
    }
  },[])

  //function to serach the users with whom logged in user have chatted
  const chattedUsers = async (page) => {
    try {
     let limit =15
      const res = await api.get(`/users/chattedUsers?limit=${limit}&page=${page}`);
      if (res.status === 200) {
    
     
         return  {
  users: res.data.users,
  page: page,
  hasMore: res.data.hasMore
}

      }
    } catch (error) {
       const status = error.response?.status;
     setLoadingUser(false)
      if(status ===500){
     
        setIsServer(500)
     
      }
      throw  error
    }
  };
 

  // function to get current chatting user
  const getCureentChattingUser = async (id) => {
    try {
   
      const res = await api.get(`/users/getUser/${id}`);
  

    return  res.data.user
    
    
    } catch (error) {
    const status = error.response?.status;

      if (status === 404) {
        showAlert("Error", error.response.data.message);

      }
      else{
   
        setIsServer(500)
     
      }
    }
  };

  const getmessages = async (page,id) => {
    try {
    
      const res = await api.get(`/messages/recieveMessage/${id}?page=${page}&limit=20`);
      if (res.status === 200) {
       hasMoreRef.current = res.data.hasMore
             setHasMore(res.data.hasMore)
        return  {
  message: res.data.message.reverse(),
  page: page,
  hasMore: res.data.hasMore
};
    
   
     
  
      }
    } catch (error) {
      const status = error.response?.status;
    if(status ===500){
      setIsServer(500)
  
      }
     throw error; 
    }
  };


const useMessage =(id)=>{
return useInfiniteQuery({
  queryKey:["messages",id],
  queryFn:({ pageParam = 1, queryKey }) => {
      const [, id] = queryKey; 
      return getmessages(pageParam, id);
    },
  getNextPageParam:(lastPage)=>{
    if(lastPage.hasMore){
      return lastPage.page+1;
    }
    return undefined
  },
  staleTime: 5000,
refetchOnWindowFocus: false,
enabled:!!conversationId,
  keepPreviousData:false
})
}

const useUser = ()=>{
  return useInfiniteQuery({
    queryKey:["users"],
    queryFn:({pageParam=1})=>{ return chattedUsers(pageParam)},
    getNextPageParam:(lastPage)=>{
      if(lastPage.hasMore){
       return lastPage.page+1
      }
      return undefined
    },
      staleTime: 5000,
refetchOnWindowFocus: false,
enabled:!!Me

  })
}
const {data:usersList,isLoading:isUsersListLoading,fetchNextPage:userListFetchNextPage}=useUser()
const chattedUsersList = usersList?.pages.flatMap(page => page.users) || [];
const useSelectedUser=(id)=>{
  return useQuery({
    queryKey:["user",id],
    queryFn:({queryKey }) => {
      const [, id] = queryKey; 
      return getCureentChattingUser( id);
    },
    staleTime:5000,
    enabled:!!id,
    refetchOnWindowFocus:false,
     keepPreviousData:false
  })
}

   const {data:selectedUser,isLoading:selectedUserLoading}=useSelectedUser(currentChatUserId);








//sendmessagee do it 
  const sendMessages = async (message) => {
    try {
      const res = await api.post(`/messages/sendMessage`,message);
    } catch (error) {
     const status = error.response?.status;
    if(status ===500){
    
      setIsServer(500)
      }
    }
  };


  useEffect(()=>{
 setReplyMessage(null)
  },[conversationId])
  const sendMedia = async (id, message) => {
    try {
      const res = await api.post(`/messages/sendFile/${id}`, message);
    } catch (error) {
     const status = error.response?.status;
    if(status ===500){
   
          setIsServer(500)
      }
    }
  };

  //function to upload a image or video or file
  const uploadCloudinary = async (id, file,tempId) => {
    try {
      setProgress(10);
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,
        formdata,
      );
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
    console.log(error.message)
      setProgress(100);
    }
  };
  /// function to get all groups
  const getAllGroups =async()=>{
 try {

      const res = await api.get(`/groups/allgroups?page=1&limit=20`);
   
   return res.data.groups
    } catch (error) {
  
     const status = error.response?.status;
    if(status ===500){
       setLoadingGroups(false)
          setIsServer(500)
      }
      throw error
    }
  }

  //function to get group by id
  const getGroupById=async(id)=>{
     try {
      const res = await api.get(`/groups/getGroupById/${id}`);
    
      
 const isAdminUser = res.data.group.participents?.some(
  (p) => p.user._id === Me._id && p.role === "admin"
);


setIsAdmin(isAdminUser);

return res.data.group

    } catch (error) {
     const status = error.response?.status;
   if (status === 500) {
          setIsServer(500)
   
      }
      throw error
    
    }
  }
  const useSelectedGroup=(id,isGroup)=>{
      return useQuery({
        queryKey:["Group",id],
        queryFn:({queryKey})=>{
          const [,id]=queryKey
          return getGroupById(id)
        },
        staleTime:5000,
        enabled:!!id && isGroup===true,
        refetchOnWindowFocus:false
      })
    }
 const {data:selectedGroup, isLoading:selectedGroupLoading}=useSelectedGroup(conversationId,isGroup)
 
 const useGroups =()=>{
  return useQuery({
    queryKey:["groups"],
    queryFn:getAllGroups,
    staleTime:5000,
    refetchOnWindowFocus:false,
    enabled:!!Me
  })
 }
const {data:allGroup,isLoading:isAllGroupLoading}=useGroups()
    const updateGroupImage = async (file) => {
    try {
        setProgress(30);
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,
        formdata,
      );
        setProgress(60);
      let image = {
        publicId: res.data.public_id,
        url: res.data.secure_url,
       
      }; 
      const responseUpdate = await api.put("/groups/groupUpdate", {image,groupId:conversationId });
  
    
        setProgress(100);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        showAlert("Error", error.response.data.message);
        setProgress(100);
      }
     
      else{
       console.log(error.message)
        setIsServer(500)
          setProgress(100);
      
      }
    }
  };
//// function to add member from group
const addMember =async(userId)=>{
    try {
      const data = {
       groupId:conversationId,
       participents:[{
        user:userId,
        role:"member"
       }]
      }
     
      const res = await api.post(`/groups/addMember`,data);
    
     
    } catch (error) {
     const status = error.response?.status;
   if (status === 404) {
        showAlert("Error", error.response.data.message);
   
      }
      else{
       
        setIsServer(500)
     
      }
    
    }
}
//// function to remove member from group
const removeMember =async(userId,tempId)=>{
    try {
   
      const data = {
       groupId:conversationId,
       participents:[{
        user:userId,
       }],
       tempId
      }
     
      const res = await api.post(`/groups/removeMember`,data);
    
    
    } catch (error) {
     const status = error.response?.status;
   if (status === 404) {
        showAlert("Error", error.response.data.message);
   
      }
      else{
       
        setIsServer(500)
     
      }
    
    }
}
const LeaveGroup =async()=>{
    try {
      const data = {
       groupId:conversationId,
      }
     
      const res = await api.patch(`/groups/leaveGroup`,data);
    setActiveGroupChat(false);
    setConversationId(null)
    setActivePage(2)
    } catch (error) {
     const status = error.response?.status;
   if (status === 404) {
        showAlert("Error", error.response.data.message);
   
      }
      else{
       
        setIsServer(500)
     
      }
    
    }
}
const deleteGroup =async()=>{
    try {
      const data = {
       groupId:conversationId,
      }
   
      const res = await api.delete(`/groups/delete`,{data});
    setActiveGroupChat(false);
    setConversationId(null)
    setActivePage(2)
    } catch (error) {
     const status = error.response?.status;
   if (status === 404) {
        showAlert("Error", error.response.data.message);
   
      }
      else{
       
        setIsServer(500)
     
      }
    
    }
}
const createGroup =async(participents,name,inviteCode,file)=>{
    try {
   
         setProgress(10);
        const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_DATABASE_NAME}/auto/upload`,
        formdata,
      );
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
      const response = await api.post(`/groups/createGroup`,data);
    
         setProgress(100);
    } catch (error) {
     const status = error.response?.status;
   if (status === 404) {
        showAlert("Error", error.response.data.message);
    setProgress(100);
      }
      else{
       
        setIsServer(500)
      setProgress(100);
      }
    
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
     useUser,
     selectedUser,
     selectedUserLoading,
       useMessage,
     
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
      setHasMore,
      getConversationId,
      setpage,
        getCureentChattingUser,
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
    LeaveGroup,
        loadingGroups,selectedGroup,
        selectedGroupLoading
      }}
    >
      {props.children}
    </ChatNovaContext.Provider>
  );
}
