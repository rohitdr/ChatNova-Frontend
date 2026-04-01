import { useContext, useEffect, useRef, useState } from "react";
import ChatNovaContext from "./ChatNovaContext";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../Api/Axios.jsx";
import AuthContext from "./AuthContext.jsx";
import SocketContext from "./SocketContext.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function ChatNovaState(props) {
  const authContext = useContext(AuthContext);
  const { setProgress,setIsServer,showAlert,setLoadingUser,user } = authContext;
const {socket} =useContext(SocketContext) 
  const [dataBaseUsers, setDataBaseUsers] = useState(null);
  const [chattedUsersList, setChattedUsersList] = useState([]);
  const [chattedOnlineUsers, setChattedOnlineUsers] = useState(null);
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  
  const [activeChat, setActiveChat] = useState(false);
const [conversationId,setConversationId]=useState(null)

  const [allGroups,setAllgroups]=useState(null)
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
useEffect(() => {

setIsAdmin(false)
  setDataBaseUsers(null)
  setChattedUsersList([])
  setChattedOnlineUsers(null)
  setCurrentChatUserId(null)
  setCurrentChatUser(null)

  setActiveChat(false)
  setConversationId(null)
  setAllgroups(null)
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

}, [user?.id])
  let Navigate = useNavigate();

  /// function to get User whom with logged in user has chats

  /// function to get the coversation id between the current chatter and logged in user
  const getConversationId = async (id) => {
    try {
      console.log("akdflaj")
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
  const serchUser = async (searchValue) => {
    try {
      const res = await api.get(`/users/search?search=${searchValue}`);
      if (res.status === 200) {
        setDataBaseUsers(res.data.users);
     
      }
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

  //function to serach the users with whom logged in user have chatted
  const chattedUsers = async (page) => {
    try {
     let limit =15
      const res = await api.get(`/users/chattedUsers?limit=${limit}&page=${page}`);
      if (res.status === 200) {
    
       console.log(res.data.users)
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
  //function to serach the users with whom logged in user have chatted
  const loadMoreChattedUsers = async (page,limit) => {
    try {
   if(!hasMoreUsers) return
      const res = await api.get(`/users/chattedUsers?limit=${limit}&page=${page}`);
      if (res.status === 200) {
    
       setChattedUsersList(prev => {
  const map = new Map();

  [...prev, ...res.data.users].forEach(item => {
    map.set(item.ConversationId, item); // unique by conversation
  });

  return Array.from(map.values());
});
        setHasMoreUsers(res.data.hasMore)
      }
    } catch (error) {
       const status = error.response?.status;
     setLoadingUser(false)
      if(status ===500){
   
        setIsServer(500)
     
      }
    }
  };

  // function to get current chatting user
  const getCureentChattingUser = async (id) => {
    try {
      setCurrentUserLoading(true)
      const res = await api.get(`/users/getUser/${id}`);
  
        setCurrentChatUser(res.data.user);
       setTimeout(() => {
        setCurrentUserLoading(false)
       }, 300);
    } catch (error) {
    const status = error.response?.status;

      if (status === 404) {
        showAlert("Error", error.response.data.message);
    setCurrentUserLoading(false)
      }
      else{
        setCurrentUserLoading(false)
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
enabled:!!conversationId
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

  })
}










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

  const sendMedia = async (id, message) => {
    try {
      const res = await api.post(`/messages/sendFile/${id}`, message);
    } catch (error) {
     const status = error.response?.status;
    if(status ===500){
      console.log(error.message)
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
       console.log(res.data)
      const message = {
        publicId: res.data.public_id,

        bytes: res.data.bytes,
        type: res.data.resource_type,
        url: res.data.secure_url,
        tempId:tempId
      };
      console.log(message)
    
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
  setLoadingGroups(true)
      const res = await api.get(`/groups/allgroups?page=1&limit=20`);
      setAllgroups(res.data.groups)
   setTimeout(() => {
    setLoadingGroups(false)
   }, 200);
    } catch (error) {
       setLoadingGroups(false)
     const status = error.response?.status;
    if(status ===500){
       setLoadingGroups(false)
          setIsServer(500)
      }
    }
  }

  //function to get group by id
  const getGroupById=async(id)=>{
     try {
      const res = await api.get(`/groups/getGroupById/${id}`);
      setCurrentGroup(res.data.message)
      console.log(res.data.message)
 const isAdminUser = res.data.message.participents?.some(
  (p) => p.user._id === user._id && p.role === "admin"
);

setIsAdmin(isAdminUser);

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
      console.log("runkdas")
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
        setReplyMessage,
     useUser,
       useMessage,
        allGroups,
   updateGroupImage,
        conversationId,
    addMember,
    firstItemIndexRef,
        activeChat,
        setActiveChat,
        loadMoreChattedUsers,
        uploadCloudinary,
        capitalizeFirstLetter,
        serchUser,
        sendMessages,
        setConversationId,
        dataBaseUsers,
     
        getmessages,
      isInitailLoadRef,
      setHasMore,
      getConversationId,
      setpage,
        getCureentChattingUser,
        setDataBaseUsers,
        setCurrentChatUserId,
        currentChatUserId,
        setChattedUsersList,
        chattedUsersList,
        hasMoreUsers,
        chattedUsers,
        chattedOnlineUsers,
        isAdmin,
        currentChatUser,
        setCurrentChatUser,
        loadingGroups,
        setAllgroups
      }}
    >
      {props.children}
    </ChatNovaContext.Provider>
  );
}
