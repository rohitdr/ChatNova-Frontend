import { useContext, useEffect, useRef, useState } from "react";
import ChatNovaContext from "./ChatNovaContext";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../Api/Axios.jsx";
import AuthContext from "./AuthContext.jsx";

export default function ChatNovaState(props) {
  const [dataBaseUsers, setDataBaseUsers] = useState(null);
  const [chattedUsersList, setChattedUsersList] = useState(null);
  const [chattedOnlineUsers, setChattedOnlineUsers] = useState(null);
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [currentUsersMessages, setCurrentUsersMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(false);
const [conversationId,setConversationId]=useState(null)

  const [allGroups,setAllgroups]=useState(null)
  const [databaseGruops,setDatabaseGroups]=useState(null)
  const [page,setpage]=useState(2)
  const [hasMore,setHasMore]=useState(true)
  const [activeGroupChat,setActiveGroupChat]=useState(false)
  const [currentGroup,setCurrentGroup]=useState(null)
 const hasMoreRef = useRef(true)
 const loadingRef = useRef(false)
const isInitailLoadRef = useRef(true)




  let Navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { setProgress,setIsServer,showAlert } = authContext;
  /// function to get User whom with logged in user has chats

  /// function to get the coversation id between the current chatter and logged in user
  const getConversationId = async (id) => {
    try {
      setCurrentUsersMessages([])
      const res = await api.get(`/messages/conversationId/${id}`);
      if (res.status === 200) {
          if(!socket) return
    if(conversationId) {
      socket.emit("leave_group",res.data.conversation._id)
    }
     
     socket.emit("join_group",res.data.conversation._id)
 
             setConversationId(res.data.conversation._id)
          getmessages(res.data.conversation._id);
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
  // function to search users from database to chat with search query
  const serchGroup = async (searchValue) => {
    try {
      const res = await api.get(`/groups/search?search=${searchValue}`);
      if (res.status === 200) {
        setDatabaseGroups(res.data.groups);
     
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
  const chattedUsers = async () => {
    try {
      const res = await api.get(`/users/chattedUsers`);
      if (res.status === 200) {
    
        setChattedUsersList(res.data.users);
        console.log(res.data.users)
      }
    } catch (error) {
       const status = error.response?.status;

      if(status ===500){
     
        setIsServer(500)
     
      }
    }
  };

  // function to get current chatting user
  const getCureentChattingUser = async (id) => {
    try {
      const res = await api.get(`/users/getUser/${id}`);
  
        setCurrentChatUser(res.data.user);
       
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

  const getmessages = async (id) => {
    try {
      const res = await api.get(`/messages/recieveMessage/${id}?page=1&limit=20`);
      if (res.status === 200) {
      console.log(res.data.message)
        setCurrentUsersMessages(res.data.message.reverse());
      console.log(res.data.hasMore)
      hasMoreRef.current = res.data.hasMore
      console.log(hasMoreRef.current)
        setHasMore(res.data.hasMore)
      }
    } catch (error) {
      const status = error.response?.status;
    if(status ===500){
  
      setIsServer(500)
      }
    }
  };
  const loadMoreMessages = async (id,page) => {
    try {
     
      if(isInitailLoadRef.current){
       isInitailLoadRef.current =false
     
        return
      }
      if( !hasMoreRef.current || loadingRef.current){
        return
      }

      loadingRef.current = true
      const res = await api.get(`/messages/recieveMessage/${id}?page=${page}&limit=20`);
      if (res.status === 200) {
        setCurrentUsersMessages(prev=>[...res.data.message.reverse(),...prev]);
        console.log(res.data.message.reverse())
         setpage(prev=>prev +1)
               hasMoreRef.current = res.data.hasMore
                 console.log(hasMoreRef.current)
        setHasMore(res.data.hasMore)
           loadingRef.current = false
           console.log(loadingRef.current)
      }
    } catch (error) {
      const status = error.response?.status;
    if(status ===500){
  
      setIsServer(500)
      }
    }
  };
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
      const res = await api.get(`/groups/allgroups`);
      setAllgroups(res.data.groups)
      console.log(res.data.groups)
    } catch (error) {
     const status = error.response?.status;
    if(status ===500){
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
       
      }; console.log(image)
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
//// function to remove member from group
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
    
     console.log(res.data.message)
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
const removeMember =async(userId)=>{
    try {
      const data = {
       groupId:conversationId,
       participents:[{
        user:userId,
       }]
      }
     
      const res = await api.post(`/groups/removeMember`,data);
    
     console.log(res.data.message)
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
        removeMember,
        setCurrentGroup,
        currentGroup,
        activeGroupChat,
        setActiveGroupChat,
        getAllGroups,
        databaseGruops,
        page,
        loadMoreMessages,
        serchGroup,
        allGroups,
   updateGroupImage,
        conversationId,
    addMember,
        activeChat,
        setActiveChat,
        uploadCloudinary,
        capitalizeFirstLetter,
        serchUser,
        sendMessages,
        setConversationId,
        dataBaseUsers,
        currentUsersMessages,
        setCurrentUsersMessages,
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
        chattedUsers,
        chattedOnlineUsers,
        currentChatUser,
        setCurrentChatUser,
      }}
    >
      {props.children}
    </ChatNovaContext.Provider>
  );
}
