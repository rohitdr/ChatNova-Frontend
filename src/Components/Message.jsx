import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import ChatNovaContext from "../Context/ChatNovaContext";
import NoServer from "./NoServer";
import {

  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Message(props) {
  const { message, send } = props;
  const authContext = useContext(AuthContext);
  const { user, isServer } = authContext;
  const context = useContext(ChatNovaContext);
  const { currentChatUser } = context;
  const [mediaView,setMediaView]=useState(false)


  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
   <> <div
      className={` w-full flex ${send ? "flex-row-reverse" : ""}  `}
    >
      <div className=" flex flex-col justify-end max-w-[15%] ">
       
        <img
          className="w-[40px] h-[38px]        lg:w-[40px]  lg:h-[41px] rounded-full  border-white border-4"
          src={send ? user?.image?.url : message?.senderId?.image?.url}
          alt=""
        />
      </div>
      <div className="flex max-w-[85%] flex-col mb-2 ">
        <div
          className={` 2xs:text-sm  xs:text-lg md:text-xl lg:text-base ${message.type === "image" || message.type === "video" ? "px-1" : "px-4"} py-1 lg:p-3 ${send ? "bg-[#6C63FF] text-white" : "bg-[#F1F3F6] text-black"} rounded-xl lg:rounded-2xl ${send ? " rounded-br-none lg:rounded-br-none " : " rounded-bl-none lg:rounded-bl-none"} `}
        >
          <div className="">
          {message.type === "text" && message.text}
          {message.type === "image" && message.media.url.split('.').pop().toLowerCase() !=="pdf" && <img src={message.media.url} onClick={()=>{setMediaView(true)}} alt="" />}
          {message.type === "video" && (
            <video width="300"  autoplay muted loop controls>
              <source src={message.media.url} type="video/mp4" />
            </video>
          )}</div>
         <div
          className={`flex text-2xs  ${send ? "justify-end" : "justify-start"}`}
        >
          <div>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        </div>{" "}
       
      </div>
    </div>
   
   
      {mediaView && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center "
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
