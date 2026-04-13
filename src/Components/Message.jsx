import { useContext, useEffect, useRef, useState }   from "react";
import React from "react";
import AuthContext from "../Context/AuthContext";
import ChatNovaContext from "../Context/ChatNovaContext";
import {
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import SocketContext from "../Context/SocketContext";
import { ArrowUturnLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
const Message= React.memo((props) =>{
  const [replyIcon,setReplyIcon]=useState("hidden")
  const queryclient = useQueryClient();
  const { message, send } = props;
  const authContext = useContext(AuthContext);
  const { Me } = authContext;
  const context = useContext(ChatNovaContext);
  const { currentChatUserId,conversationId,activeGroupChat ,setReplyMessage} = context;
  const [mediaView,setMediaView]=useState(false)
  const reactions =["👍", "❤️", "😂", "😮", "😢", "👏"]
 const [display,setDisplay]=useState("hidden")
 const reactionRef = useRef(null)
 const ignoreClick = useRef(false);
 const socketcontext  =useContext(SocketContext) 
 const {socket}=socketcontext
 useEffect(()=>{
   const handleOutsideClick =(e)=>{
    if(ignoreClick.current){
      ignoreClick.current =false
      return
    }
     if(reactionRef.current && !reactionRef.current.contains(e.target)){
      setDisplay("hidden")
     }
   }
   document.addEventListener("click",handleOutsideClick)
   return ()=>{
    document.removeEventListener("click",handleOutsideClick)
   }
 },[])
 const presstimer = useRef(null)
const handleReactionClick=(e)=>{
      if(!socket) return

      queryclient.setQueryData(["messages",conversationId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>
         { let updatedReaction;
          if(msg._id!==message._id) {return msg}
          const reaction = message.reaction || []
          const existing = reaction.filter((r)=>{
           r.user === Me._id
          }
       )
        if(existing){
          if(existing.emoji === e.target.innerHTML){
           updatedReaction = reaction.filter((r)=>
            r.user !==Me._id
          )
          
          }
          else{
             updatedReaction = reaction.map((r)=>
             r.user ===Me._id?{...r,emoji:e.target.value}:r
            )
          }
         
            
          }else{
            updatedReaction =[...reaction,{user:user_id , emoji:e.target.innerHTML}]
          }
          return {
            ...msg,
            reaction:updatedReaction
          }
        }
          )
          return {
        ...page,
        message: updatedMessage,
      };
      })
        return {
      ...oldData,
      pages: newPages,
    };
     })
    
      socket.emit("send_reaction",{
        messageId:message._id,
        conversationId:conversationId,
        emoji:e.target.innerHTML,
        userId:Me._id

      })
     
         setDisplay("hidden")

}

const messageStatus = (message, id) => {
  if (activeGroupChat) {
    const deliveredCount = message.deliveredTo?.length || 0;
    const seenCount = message.seenBy?.length || 0;

    if (deliveredCount === 0 && seenCount === 0) return "sent";
    if (deliveredCount >= 1 && seenCount === 0) return "delivered";
    if (seenCount >= 1) return "seen";

    return "sent"; 
  } else {
    const delivered = message.deliveredTo?.some(
      (d) => d.user.toString() === id
    );
    const seen = message.seenBy?.some((s) => s.user.toString() === id);

    if (!delivered) return "sent"; 
    if (!seen) return "delivered"; 
    return "seen";
  }
};

const clickReplyIcon=()=>{
  let text;
  if(message.type === "text"){
     text =message.text
  }
if(message.type === "image"){
     text ="image" && "📷 Photo"
  }
  if(message.type === "vide"){
     text ="video" && "🎥 Video"
  }
  setReplyMessage({
    messageId:message._id,
        messageType:message.type,
        text,
        senderId:message.senderId._id,
        senderName:message.senderId.name
  })

}
const onMouseEnterMessage=()=>{
  setReplyIcon("flex")
}
const onMouseLeaveMessage=()=>{
  setTimeout(() => {
     setReplyIcon("hidden")
  }, 2000);
 
}
let status = messageStatus(message,currentChatUserId)
  return(
   <> 
  {message.type !=="system" ?<div  onPointerDown={(e)=>{presstimer.current = setTimeout(()=>{setDisplay("flex");ignoreClick.current = true;},500)}}
   onPointerLeave={()=>{clearTimeout(presstimer.current)}} 
   onPointerUp={()=>{clearTimeout(presstimer.current)}} 
      className={` w-full flex ${send ? "flex-row-reverse" : ""}  relative `}
    >
      <div className=" flex flex-col justify-end max-w-[15%] ">
        <img
        loading="lazy"
          className="w-[40px] h-[38px]        lg:w-[40px]  lg:h-[41px] rounded-full  border-white border-4"
          src={send ? Me?.image?.url : message?.senderId?.image?.url}
          alt=""
        />
      </div>
      <div className="flex max-w-[85%] flex-col mb-2 relative  ">
        <span className="text-2xs m-1 mx-2  text-black">{!send && activeGroupChat&& message?.senderId?.name}</span>
        <div
          className={` 2xs:text-sm  xs:text-lg md:text-xl lg:text-base ${message.type === "image" || message.type === "video" ? "px-1 " : "px-4 lg:p-3"} py-1  ${send ? "bg-[#6C63FF] text-white" : "bg-[#F1F3F6] text-black"} rounded-xl lg:rounded-2xl ${send ? " rounded-br-none lg:rounded-br-none " : " rounded-bl-none lg:rounded-bl-none"} `}
        onMouseEnter={onMouseEnterMessage} onMouseLeave={onMouseLeaveMessage} 
        > 
     
{message.replyTo && (
  <div
    className={`
      px-2 py-2 mb-1 rounded-md 
      border-l-4 border-[#6C63FF]
      ${send 
        ? "bg-white/10 border-white/40 text-white" 
        : "bg-black/5 border-[#6C63FF]/70 text-black"}
    `}
  >
 
    <p className={`text-[11px] font-semibold leading-none 
      ${send ? "text-white/80" : "text-[#6C63FF]"}`}>
      
      {message.replyTo?.senderName|| ""}
    </p>

  
    <p className={`text-xs truncate leading-tight mt-[2px] 
      ${send ? "text-white/70" : "text-gray-600"}`}>
      
      {message.replyTo?.messageType === "text" && message.replyTo?.text} 
      {message.replyTo?.messageType === "image" && "📷 Photo"}
      {message.replyTo?.messageType === "video" && "🎥 Video"}
    </p>
  </div>
)}
          <div className="">
          {message.type === "text" && message.text}
{message.type === "image" && message.media.url.split('.').pop().toLowerCase() !== "pdf" && (
  <div className="relative group">
    <img
      loading="lazy"
      src={message.media.url}
      onClick={() => setMediaView(true)}
      className="
        max-w-[180px] sm:max-w-[220px] lg:max-w-[260px]
        max-h-[220px]
        object-cover
        rounded-xl
        cursor-pointer
        transition duration-200
        hover:scale-[1.02]
      "
      alt="chat-img"
    />

    {/* Optional overlay on hover */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition"></div>
  </div>
)}
          {message.type === "video" && (
  <div className="relative">
    <video
      className="
        max-w-[180px] sm:max-w-[220px] lg:max-w-[260px]
        max-h-[220px]
        object-cover
        rounded-xl
        shadow-md
      "
      autoPlay
      muted
      loop
      controls
    >
      <source src={message.media.url} type="video/mp4" />
    </video>
  </div>
)}</div>
         <div
          className={`flex text-2xs pt-0.5  ${send ? "justify-end" : "justify-start"}`}
        >
          <div>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
         <span>
         {send && <span className="flex">
           {status==="sent" && <CheckIcon className="h-3 w-3  text-[rgba(255,255,255,0.6)]"></CheckIcon>}
           {status ==="delivered" && <> <CheckIcon className="h-3 w-3  text-[#ffffff]"></CheckIcon><CheckIcon className="h-3 w-3 text-[#ffffff]"></CheckIcon></>}
            {status ==="seen" && <><CheckIcon className="h-3 w-3  text-[#53bdeb]"></CheckIcon><CheckIcon className="h-3 w-3 text-[#53bdeb]"></CheckIcon></>}
            
            </span>}
         
         </span>
          
        </div>
      
        
     
        
    
   
        </div>{" "}
        <div ref={reactionRef} className={`bg-white absolute z-40 rounded-3xl shadow-2xl -top-5 ${send?"right-10 lg:right-28":""}  p-2 ${display}`}>
          { reactions.map((r)=>{
             return <span className=" cursor-pointer text-3xl " key={r} onClick={handleReactionClick}>{r}</span>
          })
            
          }</div>
      </div>
    
     {message.reaction &&  <div  className={` absolute rounded-3xl shadow-2xl bottom-0  ${send?"right-9":"left-9"}  `}>
          {message.reaction.map(element => {
             return <span key={element.user}>{element.emoji}</span> 
          })}</div>}
          <div className={`${replyIcon} items-center px-4 `} > 
<div className="rounded-full bg-black/10 shadow-xl p-2" onClick={clickReplyIcon}>

         <ArrowUturnLeftIcon className="h-3 w-3 text-gray-500 cursor-pointer hover:text-[#6C63FF]" />
</div>
          </div>
    </div>:
    <div className="flex justify-center my-3">
  <div className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-gray-100/80 backdrop-blur-sm rounded-full shadow-sm">
   {message.text}
  </div>
</div>
    }
   
   
      {mediaView && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center"
          onClick={() => {
            setMediaView(false);
          }}
        >
          <div
            className="fixed shadow-xl "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {message.type === "image" && (
              <div>
                <img
                loading="lazy"
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
               src={message.media.url}
                />
                <XMarkIcon
                  className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white"
                  onClick={() => {
                    setMediaView(false);
                
                  }}
                />
             
              </div>
            )}
        
          </div>
        </div>
      )} </>
  );
})
export default Message
