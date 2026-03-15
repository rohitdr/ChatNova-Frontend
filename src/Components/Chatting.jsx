import React, { useContext, useEffect, useState } from 'react'
import { PhoneIcon,EllipsisVerticalIcon,MagnifyingGlassIcon, PaperClipIcon,ArrowLeftIcon  } from "@heroicons/react/24/outline";
import {  PaperAirplaneIcon,VideoCameraIcon ,PhotoIcon,XMarkIcon } from "@heroicons/react/24/solid";
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
  const authContext=useContext(AuthContext)
  const {user}=authContext
  const [mediaSendModal,setMediaSendModal]=useState(false)
  const {getCureentChattingUser,currentChatUser,setActiveChat,uploadCloudinary,currentChatUserId,getmessages,currentUsersMessages ,setCurrentUsersMessages,sendMessages,capitalizeFirstLetter}=Context
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
      console.log(user._id)
  if(newMessage.senderId !== user._id && 
     newMessage.receiverId !== user._id){
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
        <h2 className='mx-2 lg:mx-4 pb-1 font-medium text-xs lg:text-xl'>{capitalizeFirstLetter(currentChatUser?.name)}</h2>

        </div>
        <div className='flex  items-center justify-between'>
           <div className='mx-2 sm:mx-4'>
           <MagnifyingGlassIcon  className="w-5 h-5 text-gray-700 cursor-pointer" />
     
          </div>
          <div className='mx-2 sm:mx-4'>

           <PhoneIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>
          <div className='mx-2 sm:mx-4'>
           <VideoCameraIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

          </div>
         
          <div className=' mx-2 sm:mx-4'>

           <EllipsisVerticalIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>

           </div>
      </div>
      <div className='px-3 sm:px-6 overflow-y-auto scrollbar-hide flex-auto  '> 
        {currentUsersMessages && currentUsersMessages.map((element)=>{
          console.log(element)
          return <Message send={currentChatUserId === element.receiverId} time={new Date(element.createdAt).toLocaleTimeString([],{ hour: "2-digit",
  minute: "2-digit"})} Message={element.text} url={element.media.url} type={element.type}></Message>
        })}
       <div ref={messageEndRef}></div>
        
       
        
        
        
        
        
        </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <div className='flex xs:p-2 md:p-7 justify-between bg-white border'>

 <div className='w-full'> 
  <input type="text" onChange={(e)=>{setSendingMessage(e.target.value)}} className='bg-[#E6EBF5] rounded-md h-full w-full pl-2 ' placeholder='Enter Message...' value={sendingMessage} name="sendmessageinput" id="sendmessageinput" />
  </div> 
 <div className=' flex justify-between'> 
  
  <div className='p-2.5 px-1 sm:px-2.5  ' onClick={()=>{document.getElementById("fileMessageInput").click()}} >
  <PaperClipIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB]  cursor-pointer" />
     <input 
  type="file" 
  id="fileMessageInput" 
  accept=".pdf,.doc,.docx,.txt,.zip"
  className='hidden'
/>

  </div>
    <div className='p-2.5 px-1 sm:px-2.5' onClick={()=>{
      document.getElementById("videoMessageInput").click()
  
       }}>
  <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB]  cursor-pointer" />
     <input 
  type="file" 
  id="videoMessageInput" 
  accept="video/*" 
  className='hidden'
  onChange={videochangehandler}
/>

  </div>
  <div className='p-2.5 px-1 sm:px-2.5 mr-2' >   <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 cursor-pointer" onClick={()=>{document.getElementById("imageMessageInput").click()}} />
     <input 
  type="file" 
  id="imageMessageInput" 
  accept="image/*" 
  className='hidden'
  onChange={imagechangehandler}
/></div>
  <div className='p-2.5  bg-[#6159CB] rounded-lg' onClick={()=>{ sendMessages(currentChatUserId,sendingMessage);setSendingMessage("")} }>
  <PaperAirplaneIcon className=" w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer"  />

  </div>
  </div> 

        
      </div>
    </div>
    </div>

  {mediaSendModal &&  <div className='fixed inset-0 bg-black/20 flex items-center justify-center ' onClick={()=>{setMediaSendModal(false)}}> 
 
    <div className='fixed shadow-xl ' onClick={(e)=>{e.stopPropagation()}}>
      {uploadedImage && <div><img className='max-h-[80vh] max-w-[90vw] object-contain rounded-xl' src={URL.createObjectURL(uploadedImage)}/>
    <XMarkIcon className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white" onClick={()=>{setMediaSendModal(false);setUploadedImage(null)}}/>
 <PaperAirplaneIcon className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer" onClick={()=>{uploadCloudinary(currentChatUserId,uploadedImage); setMediaSendModal(false)}} />
</div>}
      {uploadVideo && <div> <video  autoPlay controls className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl" src={URL.createObjectURL(uploadVideo)}></video> <XMarkIcon className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white" onClick={()=>{setMediaSendModal(false);setUploadedVideo(null)}}/>
 <PaperAirplaneIcon className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer" onClick={()=>{uploadCloudinary(currentChatUserId,uploadVideo); setMediaSendModal(false)}} /></div>}
   
   </div></div>
   }
   
</>
    
  
  )
}

