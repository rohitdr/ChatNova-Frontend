import { useContext, useState } from "react";
import ChatNovaContext from "./ChatNovaContext";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import api from "../api/axios.jsx";

export default function ChatNovaState(props) {
  const [dataBaseUsers,setDataBaseUsers]=useState(null)
  const [chattedUsersList , setChattedUsersList]=useState(null)
  const[chattedOnlineUsers,setChattedOnlineUsers]=useState(null)
  const [currentChatUserId,setCurrentChatUserId]=useState(null)
  const [currentChatUser,setCurrentChatUser]=useState(null)
  const [currentUsersMessages,setCurrentUsersMessages]=useState(null)
  const [activeChat , setActiveChat]=useState(false)
  let Navigate = useNavigate();
/// function to get User whom with logged in user has chats


 
  // function to search users from database to chat with search query
  const serchUser = async(searchValue)=>{
 try{
     const res = await api.get(`/users/search?search=${searchValue}`)
     if(res.status===200){
      setDataBaseUsers(res.data.users)
   
     }
 }
 catch(error){
 console.log(error.message)
  }}
  //function to serach the users with whom logged in user have chatted
   const chattedUsers = async(searchValue)=>{
 try{
     const res = await api.get(`/users/chattedUsers`)
     if(res.status===200){
      setChattedUsersList(res.data.users)
      getCureentChattingUser(res.data.users[0]._id)
     
      setChattedOnlineUsers(res.data.onlineUsers)
   
     }
 }
 catch(error){
 console.log(error.message)
  }}

  // function to get current chatting user
   const getCureentChattingUser = async(id)=>{
 try{
     const res = await api.get(`/users/getUser/${id}`)
     if(res.status===200){
      setCurrentChatUser(res.data.user)
     
     }
 }
 catch(error){
 console.log(error.message)
  }}

    const getmessages = async(id)=>{
 try{
     const res = await api.get(`/messages/recieveMessage/${id}`)
     if(res.status===200){
      setCurrentUsersMessages(res.data.message)
 

   
     }
 }
 

 catch(error){
 console.log(error.message)
  }}

    const sendMessages = async(id,message)=>{
 try{
     const res = await api.post(`/messages/sendMessage/${id}`,{message})
     if(res.status===200){
      setCurrentUsersMessages([...currentUsersMessages,res.data.message])
  
     
   
     }
 }
 

 catch(error){
 console.log(error.message)
  }}


  return (
    <ChatNovaContext.Provider
      value={{ activeChat,setActiveChat, serchUser,sendMessages,dataBaseUsers,currentUsersMessages,setCurrentUsersMessages,getmessages,getCureentChattingUser,setDataBaseUsers,setCurrentChatUserId,currentChatUserId,setChattedUsersList,chattedUsersList,chattedUsers,chattedOnlineUsers,currentChatUser,setCurrentChatUser }}
    >
      {props.children}
    </ChatNovaContext.Provider>
  );
}
