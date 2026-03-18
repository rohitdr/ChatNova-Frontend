import React, { useContext, useEffect, useState } from "react";
import {
  PhoneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  PaperAirplaneIcon,
  VideoCameraIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Message from "./Message";
import ChatNovaContext from "../Context/ChatNovaContext";
import { useRef } from "react";
import SocketContext from "../Context/SocketContext";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
import EmptyChat from "./EmptyChat";
export default function Chatting() {
  const [sendingMessage, setSendingMessage] = useState(null);
  const messageEndRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadVideo, setUploadedVideo] = useState(null);
  const Context = useContext(ChatNovaContext);
  const authContext = useContext(AuthContext);
  const { user, isServer } = authContext;
  const [mediaSendModal, setMediaSendModal] = useState(false);
  const {
    getCureentChattingUser,
    currentChatUser,
    setActiveChat,
    uploadCloudinary,
    currentChatUserId,
    getmessages,
    currentUsersMessages,
    setCurrentUsersMessages,
    sendMessages,
    capitalizeFirstLetter,
    conversationId,
    updatedUserList,
    activeChat
  } = Context;
  const socketcontext = useContext(SocketContext);
  const { socket, onlineUsers } = socketcontext;

  useEffect(() => {
    if (currentChatUserId) {
      getmessages(currentChatUserId);
   
    }
  }, [currentChatUserId]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentUsersMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
     
      if (newMessage.conversationId !== conversationId.current._id) {
        return;
      }

      setCurrentUsersMessages((prev) => {
        if (!prev) return [newMessage];

        const exists = prev.some((msg) => msg._id === newMessage._id);
        if (exists) return prev;
        const audio = new Audio("/universfield-happy-message-ping-351298.mp3");
        audio.play().catch((err) => console.log("Audio play error:", err));

        return [...prev, newMessage];
      });
      updatedUserList(currentChatUser)
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    const handleBack = () => {
      setActiveChat(false);
    };
    window.addEventListener("popstate", handleBack);
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const imagechangehandler = (e) => {
    setMediaSendModal(true);
    setUploadedImage(e.target.files[0]);
  };
  const videochangehandler = (e) => {
    setMediaSendModal(true);
    setUploadedVideo(e.target.files[0]);
  };

  const formatLastSeen =(time)=>{
   const now = new Date();
   const last = new Date(time)
   let diff = Math.floor((now-last)/1000)
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return last.toLocaleDateString();
  }
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
     {currentChatUserId ? <div className={`h-screen bg-white`}>
        <div className="flex h-full flex-col justify-between">
          <div className="shrink-0 flex flex-row p-4 lg:p-7 border justify-between">
            <div className="flex items-center justify-between">
              <ArrowLeftIcon
                className="w-6 h-6 text-gray-700 lg:hidden"
                onClick={() => {
                  setActiveChat(false);
                }}
              />
              <img
                className="lg:h-14 lg:w-14 h-10 w-10 rounded-full border-white border-4"
                src={currentChatUser?.image.url}
                alt=""
              />
              <div className="flex flex-col items-center">
                <h2 className="mx-2 lg:mx-4 pt-2 font-medium text-xs lg:text-xl">
                  {capitalizeFirstLetter(currentChatUser?.name)}
                </h2>
                {onlineUsers?.includes(currentChatUser?._id) ? (
                  <p className="text-xs h-4 ">online</p>
                ) : (
                  <p className="text-xs h-4 ">{formatLastSeen(currentChatUser?.lastSeen?currentChatUser.lastSeen:"")}</p>
                )}
              </div>
            </div>
            <div className="flex  items-center justify-between">
              <div className="mx-2 sm:mx-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
              </div>
              <div className="mx-2 sm:mx-4">
                <PhoneIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
              </div>
              <div className="mx-2 sm:mx-4">
                <VideoCameraIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
              </div>

              <div className=" mx-2 sm:mx-4">
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className=" px-3 sm:px-6 overflow-y-auto scrollbar-hide flex-1 min-h-0 ">
            {currentUsersMessages &&
              currentUsersMessages.map((element) => {
                return (
                  <Message
                    send={currentChatUserId === element.receiverId}
                    message={element}
                  ></Message>
                );
              })}
            <div ref={messageEndRef}></div>
          </div>

          <div className="shrink-0 flex xs:p-2 md:p-7 justify-between bg-white border">
            <div className="w-full">
              <input
                type="text"
                onChange={(e) => {
                  setSendingMessage(e.target.value);
                }}
                className="bg-[#E6EBF5] rounded-md h-full w-full pl-2 "
                placeholder="Enter Message..."
                value={sendingMessage}
                name="sendmessageinput"
                id="sendmessageinput"
              />
            </div>
            <div className=" flex justify-between">
              <div
                className="p-2.5 px-1 sm:px-2.5  "
                onClick={() => {
                  document.getElementById("fileMessageInput").click();
                }}
              >
                <PaperClipIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB]  cursor-pointer" />
                <input
                  type="file"
                  id="fileMessageInput"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  className="hidden"
                />
              </div>
              <div
                className="p-2.5 px-1 sm:px-2.5"
                onClick={() => {
                  document.getElementById("videoMessageInput").click();
                }}
              >
                <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB]  cursor-pointer" />
                <input
                  type="file"
                  id="videoMessageInput"
                  accept="video/*"
                  className="hidden"
                  onChange={videochangehandler}
                />
              </div>
              <div className="p-2.5 px-1 sm:px-2.5 mr-2">
                {" "}
                <PhotoIcon
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 cursor-pointer"
                  onClick={() => {
                    document.getElementById("imageMessageInput").click();
                  }}
                />
                <input
                  type="file"
                  id="imageMessageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={imagechangehandler}
                />
              </div>
              <div
                className="p-2.5  bg-[#6159CB] rounded-lg"
                onClick={() => {
                  if (sendingMessage !== "") {
                    sendMessages(currentChatUserId, sendingMessage);
                    setSendingMessage("");
                  }
                }}
              >
                <PaperAirplaneIcon className=" w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div> : <EmptyChat></EmptyChat>}

      {mediaSendModal && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center "
          onClick={() => {
            setMediaSendModal(false);
          }}
        >
          <div
            className="fixed shadow-xl "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {uploadedImage && (
              <div>
                <img
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
                  src={URL.createObjectURL(uploadedImage)}
                />
                <XMarkIcon
                  className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white"
                  onClick={() => {
                    setMediaSendModal(false);
                    setUploadedImage(null);
                  }}
                />
                <PaperAirplaneIcon
                  className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer"
                  onClick={() => {
                    uploadCloudinary(currentChatUserId, uploadedImage);
                    setMediaSendModal(false);
                  }}
                />
              </div>
            )}
            {uploadVideo && (
              <div>
                {" "}
                <video
                  autoPlay
                  controls
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
                  src={URL.createObjectURL(uploadVideo)}
                ></video>{" "}
                <XMarkIcon
                  className="h-8 w-8 absolute cursor-pointer top-6 right-6 text-white"
                  onClick={() => {
                    setMediaSendModal(false);
                    setUploadedVideo(null);
                  }}
                />
                <PaperAirplaneIcon
                  className=" w-8 h-8 absolute  bottom-6 right-6 text-white cursor-pointer"
                  onClick={() => {
                    uploadCloudinary(currentChatUserId, uploadVideo);
                    setMediaSendModal(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
