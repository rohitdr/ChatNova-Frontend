import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Context/AuthContext";
import ChatNovaContext from "../Context/ChatNovaContext";
import NoServer from "./NoServer";
import {

  XMarkIcon,
} from "@heroicons/react/24/solid";
import SocketContext from "../Context/SocketContext";
import { CheckIcon } from "@heroicons/react/24/outline";
export default function Message(props) {
  const { message, send } = props;
  const authContext = useContext(AuthContext);
  const { user, isServer } = authContext;
  const context = useContext(ChatNovaContext);
  const { currentChatUser,currentChatUserId,conversationId,activeGroupChat ,setCurrentUsersMessages} = context;
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
   setCurrentUsersMessages((prev)=>
         prev.map(msg=>{
          let updatedReaction;
          if(msg._id!==message._id) {return msg}
          const reaction = message.reaction || []
          const existing = reaction.filter((r)=>{
           r.user === user._id
          }
       )
        if(existing){
          if(existing.emoji === e.target.innerHTML){
           updatedReaction = reaction.filter((r)=>
            r.user !==user._id
          )
          
          }
          else{
             updatedReaction = reaction.map((r)=>
             r.user ===user._id?{...r,emoji:e.target.value}:r
            )
          }
         
            
          }else{
            updatedReaction =[...reaction,{user:user_id , emoji:e.target.innerHTML}]
          }
          return {
            ...msg,
            reaction:updatedReaction
          }
      

 } )
   )
    
      socket.emit("send_reaction",{
        messageId:message._id,
        conversationId:conversationId,
        emoji:e.target.innerHTML,
        userId:user._id

      })
     
         setDisplay("hidden")

}

const messageStatus = (message,id)=>{

  if(activeGroupChat){
    if(message.deliveredTo?.length===0 && message.seenBy?.length ===0){
      return "sent"
    }
  if(message.deliveredTo?.length>=1 && message.seenBy?.length ===0){
    return "delivered"
  }
  if(message.seenBy?.length>=1){
    return "seen"

  }

  }
  else{
const delivered = message.deliveredTo?.some((d)=>
 d.user.toString()=== id

)
const seen = message.seenBy?.some((d)=>
 d.user.toString()=== id

)
if(!delivered) return "sent"
if(!seen) return "delivered"
return "seen"
  }
 



}


let status = messageStatus(message,currentChatUserId)

  


  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
   <> <div  onPointerDown={(e)=>{presstimer.current = setTimeout(()=>{setDisplay("flex");ignoreClick.current = true;},500)}}
   onPointerLeave={()=>{clearTimeout(presstimer.current)}} 
   onPointerUp={()=>{clearTimeout(presstimer.current)}} 
      className={` w-full flex ${send ? "flex-row-reverse" : ""}  relative `}
    >
      <div className=" flex flex-col justify-end max-w-[15%] ">
       
        <img
          className="w-[40px] h-[38px]        lg:w-[40px]  lg:h-[41px] rounded-full  border-white border-4"
          src={send ? user?.image?.url : message?.senderId?.image?.url}
          alt=""
        />
      </div>
      <div className="flex max-w-[85%] flex-col mb-2 relative  ">
        <div
          className={` 2xs:text-sm  xs:text-lg md:text-xl lg:text-base ${message.type === "image" || message.type === "video" ? "px-1" : "px-4"} py-1 lg:p-3 ${send ? "bg-[#6C63FF] text-white" : "bg-[#F1F3F6] text-black"} rounded-xl lg:rounded-2xl ${send ? " rounded-br-none lg:rounded-br-none " : " rounded-bl-none lg:rounded-bl-none"} `}
        >
          <div className="">
          {message.type === "text" && message.text}
          {message.type === "image" && message.media.url.split('.').pop().toLowerCase() !=="pdf" && <img src={message.media.url} className="" onClick={()=>{setMediaView(true)}} alt="" />}
          {message.type === "video" && (
            <video width="300" className="" autoplay muted loop controls>
              <source src={message.media.url} type="video/mp4" />
            </video>
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
        <div ref={reactionRef} className={`bg-white absolute rounded-3xl shadow-2xl -top-5 ${send?"right-28":""}  p-2 ${display}`}>
          { reactions.map((r)=>{
             return <span className=" cursor-pointer text-3xl " key={r} onClick={handleReactionClick}>{r}</span>
          })
            
          }</div>
      </div>
    
     {message.reaction &&  <div  className={` absolute rounded-3xl shadow-2xl bottom-0  ${send?"right-9":"left-9"}  `}>
          {message.reaction.map(element => {
             return <span key={element.user}>{element.emoji}</span> 
          })}</div>}
    </div>
   
   
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
}
