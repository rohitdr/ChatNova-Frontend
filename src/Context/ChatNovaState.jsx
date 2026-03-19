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
  const conversationId = useRef(null);

  let Navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { setProgress,setIsServer,showAlert } = authContext;
  /// function to get User whom with logged in user has chats

  /// function to get the coversation id between the current chatter and logged in user
  const getConversationId = async (id) => {
    try {
      const res = await api.get(`/messages/conversationId/${id}`);
      if (res.status === 200) {
        conversationId.current = res.data.conversation;
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
  const chattedUsers = async () => {
    try {
      const res = await api.get(`/users/chattedUsers`);
      if (res.status === 200) {
    
        setChattedUsersList(res.data.users);


        setChattedOnlineUsers(res.data.onlineUsers);
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
      const res = await api.get(`/messages/recieveMessage/${id}`);
      if (res.status === 200) {
        setCurrentUsersMessages(res.data.message);
      }
    } catch (error) {
      const status = error.response?.status;
    if(status ===500){
  
      setIsServer(500)
      }
    }
  };

  const sendMessages = async (id, message) => {
    try {
      const res = await api.post(`/messages/sendMessage/${id}`, { message });
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
          setIsServer(500)
      }
    }
  };

  //function to upload a image or video or file
  const uploadCloudinary = async (id, file) => {
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
      };
      console.log(message)
    
      setProgress(60);
      sendMedia(id, message);
      setProgress(100);
    } catch (error) {
   
      setProgress(100);
    }
  };

 
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
     
        getConversationId,
        conversationId,
        activeChat,
        setActiveChat,
        uploadCloudinary,
        capitalizeFirstLetter,
        serchUser,
        sendMessages,
        dataBaseUsers,
        currentUsersMessages,
        setCurrentUsersMessages,
        getmessages,
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
