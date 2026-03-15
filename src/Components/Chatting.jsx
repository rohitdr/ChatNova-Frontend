import React, { useContext, useEffect, useState } from 'react'
import { PhoneIcon,EllipsisVerticalIcon,MagnifyingGlassIcon, PaperClipIcon,ArrowLeftIcon  } from "@heroicons/react/24/outline";
import {  PaperAirplaneIcon,VideoCameraIcon ,PhotoIcon } from "@heroicons/react/24/solid";
import Message from './Message';

import ChatNovaContext from '../Context/ChatNovaContext';
import { useRef } from 'react';
import SocketContext from '../Context/SocketContext';
import AuthContext from '../Context/AuthContext';
export default function Chatting() {
const [sendingMessage,setSendingMessage]=useState("")
const messageEndRef = useRef(null)
const [uploadedImage,setUploadedImage]=useState(null)
const [uploadVideo,setUploadedVideo]=useState(null)
  const Context = useContext(ChatNovaContext)
  const [mediaSendModal,setMediaSendModal]=useState(false)
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
  console.log(newMessage.senderId+" "+newMessage.receiverId)
  if(newMessage.senderId !== currentChatUserId && 
     newMessage.receiverId !== currentChatUserId){
      console.log("return")
    return
  }

  setCurrentUsersMessages(prev=>{
    if(!prev) return [newMessage]

    const exists = prev.some(msg=>msg._id === newMessage._id)
    if(exists) return prev
 const audio = new Audio('/universfield-happy-message-ping-351298.mp3');
    audio.play().catch(err => console.log('Audio play error:', err));
    console.log([...prev,newMessage])
    return [...prev,newMessage]
  })

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

const imagechangehandler=(e)=>{
  setMediaSendModal(true)
setUploadedImage(e.target.files[0])
console.log(e.target.files[0])
}
const videochangehandler=(e)=>{
  setMediaSendModal(true)
setUploadedVideo(e.target.files[0])
}
  
  return (<>
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
          return <Message send={currentChatUserId === element.receiverId} time={new Date(element.createdAt).toLocaleTimeString([],{ hour: "2-digit",
  minute: "2-digit"})} Message={element.message}></Message>
        })}
       <div ref={messageEndRef}></div>
        
       
        
        
        
        
        
        </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <div className='flex p-7 justify-between bg-white border'>

 <div className='w-full'> 
  <input type="text" onChange={(e)=>{setSendingMessage(e.target.value)}} className='bg-[#E6EBF5] rounded-md h-full w-full pl-2 ' placeholder='Enter Message...' value={sendingMessage} name="sendmessageinput" id="sendmessageinput" />
  </div> 
 <div className=' flex justify-between'> 
  
  <div className='p-2.5 ' onClick={()=>{document.getElementById("fileMessageInput").click()}} >
  <PaperClipIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />
     <input 
  type="file" 
  id="fileMessageInput" 
  accept=".pdf,.doc,.docx,.txt,.zip"
  className='hidden'
/>

  </div>
    <div className='p-2.5 ' onClick={()=>{
      document.getElementById("videoMessageInput").click()
  
       }}>
  <VideoCameraIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />
     <input 
  type="file" 
  id="videoMessageInput" 
  accept="video/*" 
  className='hidden'
  onChange={videochangehandler}
/>

  </div>
  <div className='p-2.5 mr-2' >   <PhotoIcon className="w-6 h-6 text-red-400 cursor-pointer" onClick={()=>{document.getElementById("imageMessageInput").click()}} />
     <input 
  type="file" 
  id="imageMessageInput" 
  accept="image/*" 
  className='hidden'
  onChange={imagechangehandler}
/></div>
  <div className='p-2.5  bg-[#6159CB] rounded-lg' onClick={()=>{ sendMessages(currentChatUserId,sendingMessage);setSendingMessage("")} }>
  <PaperAirplaneIcon className=" w-6 h-6 text-white cursor-pointer"  />

  </div>
  </div> 

        
      </div>
    </div>
    </div>

  {mediaSendModal &&  <div className='fixed inset-0 bg-black/20 flex items-center justify-center ' onClick={()=>{setMediaSendModal(false)}}> 
 
    <div className='fixed shadow-xl   bg-white ' onClick={(e)=>{e.stopPropagation()}}>
      {uploadedImage && <img className='' src={URL.createObjectURL(uploadedImage)}></img>}
      {uploadVideo && <video src={URL.createObjectURL(uploadVideo)}></video>}
   
   </div></div>
   }
   
</>
    
  
  )
}

