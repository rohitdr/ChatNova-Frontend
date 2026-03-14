import React, { useContext, useEffect, useState } from 'react'
import { PhoneIcon,EllipsisVerticalIcon,MagnifyingGlassIcon,VideoCameraIcon, FaceSmileIcon, PaperClipIcon,ArrowLeftIcon  } from "@heroicons/react/24/outline";
import {  PaperAirplaneIcon  } from "@heroicons/react/24/solid";
import Message from './Message';

import ChatNovaContext from '../Context/ChatNovaContext';
import { useRef } from 'react';
import SocketContext from '../Context/SocketContext';
import AuthContext from '../Context/AuthContext';
export default function Chatting() {
const [sendingMessage,setSendingMessage]=useState("")
const messageEndRef = useRef(null)
const authContext=useState(AuthContext)
const {user}=authContext
  const Context = useContext(ChatNovaContext)
  const {getCureentChattingUser,currentChatUser,setActiveChat,currentChatUserId,getmessages,currentUsersMessages ,setCurrentUsersMessages,sendMessages}=Context
 const socketcontext = useContext(SocketContext)
 const {socket}=socketcontext
 useEffect(()=>{
  if(currentChatUserId){

    getmessages(currentChatUserId)
  }
 },[currentChatUserId])
 useEffect(()=>{
messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
 },[currentUsersMessages])



useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (newMessage) => {
 const audio = new Audio('/universfield-happy-message-ping-351298.mp3');
    audio.play().catch(err => console.log('Audio play error:', err));
    setCurrentUsersMessages((prevMessages) => [...prevMessages, newMessage])
 
  }

  socket.on("newMessage", handleNewMessage)

  return () => {
    socket.off("newMessage", handleNewMessage)
  }
}, [socket])

useEffect(()=>{
  const handleBack=()=>{
    setActiveChat(false)
  }
window.addEventListener('popstate',handleBack)
return ()=>{ window.removeEventListener('popstate',handleBack)}
},[])
  
  return (
       <div className='h-screen bg-white '>
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-row p-4 lg:p-7 border justify-between'>
     
        <div className='flex items-center justify-between'>
           <ArrowLeftIcon className="w-6 h-6 text-gray-700 lg:hidden" onClick={()=>{setActiveChat(false)}} />
        <img className='h-10 w-10 rounded-full border-white border-4' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
        <h2 className='mx-2 lg:mx-4 pb-1 text-xs lg:text-xl'>{currentChatUser?.name}</h2>

        </div>
        <div className='flex  items-center justify-between'>
           <div className='mx-4'>
           <MagnifyingGlassIcon  className="w-5 h-5 text-gray-700 cursor-pointer" />
     
          </div>
          <div className='mx-4'>

           <PhoneIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>
          <div className='mx-4'>
           <VideoCameraIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

          </div>
         
          <div className='mx-4'>

           <EllipsisVerticalIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>

           </div>
      </div>
      <div className='px-6 overflow-y-auto scrollbar-hide flex-auto  '> 
        {currentUsersMessages && currentUsersMessages.map((element)=>{
          return <Message send={currentChatUserId === element.receiverId && user?._id === element.senderId } time={new Date(element.createdAt).toLocaleTimeString([],{ hour: "2-digit",
  minute: "2-digit"})} Message={element.message}></Message>
        })}
       <div ref={messageEndRef}></div>
        
       
        
        
        
        
        
        </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <div className='flex p-7 justify-between bg-white border'>

 <div className='w-full'> 
  <input type="text" onChange={(e)=>{setSendingMessage(e.target.value)}} className='bg-[#E6EBF5] rounded-md h-full w-full pl-2 ' placeholder='Enter Message...' value={sendingMessage} name="sendmessageinput" id="sendmessageinput" />
  </div> 
 <div className=' flex justify-between'> 
  <div className='p-2.5'>

  <FaceSmileIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />
  </div>
  <div className='p-2.5'>
  <PaperClipIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />

  </div>
  <div className='p-2.5 bg-[#6159CB] rounded-lg' onClick={async()=>{ await sendMessages(currentChatUserId,sendingMessage);setSendingMessage("")} }>
  <PaperAirplaneIcon className="w-6 h-6 text-white cursor-pointer"  />

  </div>
  </div> 

        
      </div>
    </div>
    </div>
  
  )
}

