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
import { Virtuoso } from "react-virtuoso";
import TypingIndicator from "./TypingIndicator";
import MessageSkeleton from "./MessageSkeleton";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function Chatting() {
  const [sendingMessage, setSendingMessage] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadVideo, setUploadedVideo] = useState(null);
  const [uploadFile, setUplaodFile] = useState(null);
  const Context = useContext(ChatNovaContext);
  const authContext = useContext(AuthContext);
  const { user, isServer, activePage, showAlert, setActivePage,Me } =
    authContext;
  const [fileType, setFileType] = useState(null);

  const [mediaSendModal, setMediaSendModal] = useState(false);
  const [typingUser, setTypingUser] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const {
    useMessage,
    useSelectedUser,
setReplyMessage,

    chattedUsersList,
    currentUserLoading,
     replyMessage,
      selectedUser,
      selectedUserLoading,
    setActiveChat,
    uploadCloudinary,
    currentChatUserId,
    setChattedUsersList,
useSelectedGroup,
  isGroup,
    chattedUsers,

    sendMessages,
    isInitailLoadRef,
    capitalizeFirstLetter,
    conversationId,
    firstItemIndexRef,
    activeGroupChat,
selectedGroup,
selectedGroupLoading,
    currentGroup,
    activeChat,
   
  } = Context;
  const {data,isLoading,fetchNextPage}=useMessage(conversationId) 

const messages = data?.pages.slice().reverse().flatMap(page=>page.message)||[]
const queryclient = useQueryClient();
  const socketcontext = useContext(SocketContext);
  const { socket, onlineUsers } = socketcontext;






  useEffect(() => {
    if (!socket) return;
    const handler = ({ messageId, reaction }) => {
        queryclient.setQueryData(["messages",conversationId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>
          msg._id === messageId ? { ...msg, reaction: reaction } : msg,
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
    };
    socket.on("reaction_updated", handler);

    return () => {
      socket.off("reaction_updated", handler);
    };
  }, [socket,conversationId]);
useEffect(() => {
  if (!conversationId) return;

  queryclient.setQueryData(["users"], (oldData) => {
    if (!oldData) return oldData;

    const newPages = oldData.pages.map((page) => {
      const updatedUsers = page.users.map((user) => {
        if (user.ConversationId === conversationId) {
          return {
            ...user,
            unreadCount: 0,
          };
        }
        return user;
      });

      return {
        ...page,
        users: updatedUsers,
      };
    });

    return {
      ...oldData,
      pages: newPages,
    };
  });
}, [conversationId]);
  useEffect(() => {
    if (!socket) return;
    const deliverHandler = ({ messageId, deliveredTo }) => {
     queryclient.setQueryData(["messages",conversationId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>
          msg._id === messageId ? { ...msg, deliveredTo: [...new Set([...msg.deliveredTo, ...deliveredTo])] } : msg,
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
      


    };

    socket.on("message_deliverd", deliverHandler);

    return () => {
      socket.off("message_deliverd", deliverHandler);
    };
  }, [socket,conversationId]);
  useEffect(() => {
    if (!socket) return;
    const seenHandler = ({conversationId:convId,userId, seenAt }) => {
  
         queryclient.setQueryData(["messages",convId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>{
         const alreadySeen = msg.seenBy.some((s)=>s.user.toString() === userId)
       if(msg.senderId.toString() !==userId && !alreadySeen){
        return{
          ...msg,
          seenBy:[...msg.seenBy,{user:userId,seenAt}]
        }
       }
        return msg})
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
   queryclient.setQueryData(["groups"], (oldData) => {
  if (!oldData) return oldData;

  const groups = oldData.map((group) => {
    const participents = group.participents?.map((p) => {
      if (p.user.toString() === userId) {
        return { ...p, unreadCount: 0 };
      }
      return p;
    });

    return { ...group, participents };
  });

  return [...groups];
});
   

    };

    socket.on("message_seen", seenHandler);

    return () => {
      socket.off("message_seen", seenHandler);
    };
  }, [socket]);
 const updateMessageToQuerySocket = (newMessage) => {
  queryclient.setQueryData(["messages", conversationId], (oldData) => {
    if (!oldData) return oldData;

    let replaced = false;
let alreadyExists=false
    const newPages = oldData.pages.map((page) => {
      const updatedMessages = page.message.map((msg) => {
        if (msg._id === newMessage.tempId) {
          replaced = true;
          return newMessage; // ✅ sender case
        }
        if (msg._id === newMessage._id) {
          alreadyExists = true;
        }
        return msg;
      });

      return {
        ...page,
        message: updatedMessages,
      };
    });

   
    if (!replaced && !alreadyExists) {
      newPages[0] = {
        ...newPages[0],
        message: [
          ...newPages[0].message,
          newMessage,
        ],
      };
    }

    return {
      ...oldData,
      pages: newPages,
    };
  });
};

  // useEffect(() => {
  //   virtuosoRef.current?.scrollToIndex({
  //     index: messages.length - 1,
  //     behavior: "auto",
  //   });
  // }, [typingUser]);

const updateUsersList = (newMessage, currentUserId, activeConversationId) => {
  //checking conversationType
if (newMessage.conversationToSend?.type !== "private") return;
  queryclient.setQueryData(["users"], (oldData) => {
    if (!oldData) return oldData;

    const lastMessage = {
      text: newMessage.text,
      createdAt: newMessage.createdAt,
    };

    const newPages = oldData.pages.map((page, pageIndex) => {
      let users = [...page.users];

      const index = users.findIndex(
        (c) => c.ConversationId === newMessage.conversationId
      );

      const isCurrentChatOpen =
        newMessage.conversationId === activeConversationId;

      if (index !== -1) {
        const oldUser = users[index];

        const updatedUser = {
          ...oldUser,
          lastMessage,
          participents: newMessage.conversationToSend?.participents,
          unreadCount:
            Me?._id !== newMessage.senderId._id
              ? isCurrentChatOpen
                ? 0
                : (oldUser.unreadCount || 0) + 1
              : 0,
        };

        users = users.filter(
          (c) => c.ConversationId !== newMessage.conversationId
        );

        return {
          ...page,
          users: [updatedUser, ...users],
        };
      }

      if (pageIndex === 0) {
        const newuser = newMessage.conversationToSend?.participents?.find(
          (p) => p.user._id !== currentUserId
        );

        if (!newuser) return page;

        return {
          ...page,
          users: [
            {
              ConversationId: newMessage.conversationToSend.ConversationId,
              lastMessage,
              user: newuser.user,
              unreadCount:
                Me?._id !== newMessage.senderId._id
                  ? isCurrentChatOpen
                    ? 0
                    : 1
                  : 0,
            },
            ...users,
          ],
        };
      }

      return page;
    });

    return { ...oldData, pages: newPages };
  });
};

 const UpdateGroupList =(newMessage)=>{
if (newMessage.conversationToSend?.type !== "group") return;
  console.log(newMessage.conversationToSend)
      queryclient.setQueryData(["groups"],(oldData)=>{
       if(!oldData) return oldData
      
        const filterd =oldData.filter((group)=>group._id !== newMessage.conversationToSend._id)
          return [newMessage.conversationToSend,...filterd]
      })

     
    }
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.conversationId === conversationId) 
      ) {
       if(newMessage.senderId._id !== Me?._id){

         socket.emit("mark_seen", {
           conversationId: conversationId,
           userId: Me._id,
         });
       }
        /// setting current user chat
       updateMessageToQuerySocket(newMessage)
      }
  
      UpdateGroupList(newMessage)
      updateUsersList(newMessage,Me._id,conversationId)
  

    
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId,socket]);



  const imagechangehandler = (e) => {
    if (e.target.files[0].size > 10000000) {
      showAlert("Error", "Image size should be less than 10 mb");
      e.target.value = null;
    } else {
      setMediaSendModal(true);
      setUploadedImage(e.target.files[0]);
      e.target.value = null;
    }
  };
  const videochangehandler = (e) => {
    if (e.target.files[0].size > 10000000) {
      showAlert("Error", "Video size should be less than 10 mb");
      e.target.value = null;
    } else {
      setMediaSendModal(true);
      setUploadedVideo(e.target.files[0]);
      e.target.value = null;
    }
  };
  const fileChangeHandler = (e) => {
    if (e.target.files[0].size > 10000000) {
      showAlert("Error", "File size should be less than 10 mb");
    } else {
      uploadCloudinary(currentChatUserId, e.target.files[0]);
    }
  };
  const formatLastSeen = (time) => {
    const now = new Date();
    const last = new Date(time);
    let diff = Math.floor((now - last) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `Active ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return ` Active ${Math.floor(diff / 3600)} hr ago`;

    return last.toLocaleDateString("en-GB");
  };

  const sendMessageToQueryUser=(message)=>{
queryclient.setQueryData(["messages",conversationId],(oldData)=>{
 if(!oldData) return oldData
 const newPages = [...oldData.pages]
  newPages[0].message.push(message)
  return {...oldData,pages:newPages}
})
  }

  const handleSendMessage = () => {
    if (sendingMessage !== "") {
      const tempmessage = {
        _id: Date.now(),
        type: "text",
        text: sendingMessage,
        createdAt: Date.now(),
        senderId: {
          _id: Me._id,
          image: {
            url: Me.image?.url,
          },
        },
        replyTo:replyMessage
      };

      activeGroupChat
        ? sendMessages({
            conversationId: conversationId,
             receiverId: currentChatUserId,
            message: sendingMessage,
            tempId: tempmessage._id,
            replyTo:replyMessage
          })
        : sendMessages({
            receiverId: currentChatUserId,
             conversationId: conversationId,
            message: sendingMessage,
            tempId: tempmessage._id,
            replyTo:replyMessage
          });
      sendMessageToQueryUser(tempmessage);

      setSendingMessage("");
      setReplyMessage(null)
    }
    // setTimeout(() => {
    //   virtuosoRef.current?.scrollToIndex({
    //     index: messages.length - 1,
    //     align: "end",
    //     behavior: "auto",
    //   });
    // }, 0);
  };
 


  const handleUploadImage = () => {
    const tempmessage = {
      _id: Date.now(),
      type: "image",
      text: "New Photo",
      createdAt: Date.now(),
      senderId: {
        _id: Me._id,
        image: {
          url: Me.image?.url,
        },
      },
      media: {
        url: URL.createObjectURL(uploadedImage),
      },
    };
    sendMessageToQueryUser(tempmessage);

    uploadCloudinary(conversationId, uploadedImage, tempmessage._id);
    setMediaSendModal(false);
     setUploadedImage(null);
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("user_stop_typing", ({ userId }) => {
      setTypingUser((prev) => prev.filter((p) => p.user !== userId));
    });
    socket.on("user_typing", ({ userId, name }) => {
      setTypingUser((prev) => {
        if (prev.find((p) => p.user === userId)) {
          return prev;
        }
        return [...prev, { user: userId, name }];
      });
    });
    return () => {
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [socket]);

  const handleUploadVideo = () => {
    const tempmessage = {
      _id: Date.now(),
      type: "video",
      text: "New Video",
      createdAt: Date.now(),
      senderId: {
        _id: Me._id,
        image: {
          url: Me.image?.url,
        },
      },
      media: {
        url: URL.createObjectURL(uploadVideo),
      },
    };
   sendMessageToQueryUser(tempmessage);

    uploadCloudinary(conversationId, uploadVideo, tempmessage._id);
    setMediaSendModal(false);
    setUploadedVideo(null)
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId,
        userId: Me._id,
        name: Me.name,
      });
    }
  };
  let typingTimout;
  const handleStopTyping = () => {
    clearTimeout(typingTimout);
    setIsTyping(false);
    typingTimout = setTimeout(() => {
      socket.emit("stop_typing", {
        conversationId,
        userId: Me._id,
        name: Me.name,
      });
    }, 4000);
  };
  return  (
    <>  
      {currentChatUserId || activeGroupChat ? (
        <div className={`h-[100svh] md:h-screen bg-white`}>
          <div className="flex h-full flex-col justify-between">
            {!selectedUserLoading  || messages.length!==0 ? (
              <div
                className="shrink-0 flex items-center justify-between px-3 py-2 lg:px-6 lg:py-3 
bg-white/80 backdrop-blur-md border-b shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeftIcon
                    className="w-6 h-6 text-gray-700 cursor-pointer lg:hidden hover:scale-110 transition"
                    onClick={() => setActiveChat(false)}
                  />

                  <div className="relative">
                    <img
                      loading="lazy"
                      className="lg:h-12 lg:w-12 h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                      src={
                        activeGroupChat
                          ? selectedGroup?.avtar?.url
                          : selectedUser?.image.url
                      }
                      alt=""
                    />

                    {!activeGroupChat &&
                      onlineUsers?.includes(selectedUser?._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                  </div>

                  <div
                    className="flex flex-col cursor-pointer"
                    onClick={() => {
                      if (activeGroupChat) {
                        setActivePage(4);
                        setActiveChat(false);
                      }
                    }}
                  >
                    <h2 className="text-sm lg:text-lg font-semibold text-gray-900">
                      {capitalizeFirstLetter(
                        activeGroupChat
                          ? selectedGroup?.name
                          : selectedUser?.name,
                      )}
                    </h2>

                    {!activeGroupChat &&
                      (onlineUsers?.includes(selectedUser?._id) ? (
                        <span className="text-xs text-green-500 font-medium">
                          online
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {formatLastSeen(selectedUser?.lastSeen || "")}
                        </span>
                      ))}
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4 text-gray-600">
                  <MagnifyingGlassIcon className="w-5 h-5 cursor-pointer hover:text-blue-500 hover:scale-110 transition" />

                  <PhoneIcon className="w-5 h-5 cursor-pointer hover:text-green-500 hover:scale-110 transition" />

                  <VideoCameraIcon className="w-5 h-5 cursor-pointer hover:text-purple-500 hover:scale-110 transition" />

                  <EllipsisVerticalIcon className="w-5 h-5 cursor-pointer hover:text-gray-900 hover:scale-110 transition" />
                </div>
              </div>
            ) : (
              <ChatHeaderSkeleton></ChatHeaderSkeleton>
            )}
            <div
              className={` px-3 sm:px-6  scrollbar-hide flex-1 min-h-0  ${isLoading && " overflow-y-auto "} `}
            >  
              { !isLoading || messages.length!==0 ? (
                <Virtuoso
                  className="scrollbar-hide"
                 
                  computeItemKey={(index, message) => message._id}
                  firstItemIndex={firstItemIndexRef.current}
                  initialTopMostItemIndex={
                    messages.length > 0
                      ? messages.length - 1
                      : undefined
                  }
                  style={{ height: "100%" }}
                  increaseViewportBy={{ top: 500, bottom: 300 }}
                  data={messages}
                  // followOutput="auto"
               
                  rangeChanged={(range) => {
                    const isAtTop =
                      range.startIndex <= firstItemIndexRef.current + 2;

                    if (isAtTop) {
                      fetchNextPage()
                    }
                  }}
               
                  itemContent={(index, message) => (
                   <div className={index === firstItemIndexRef.current - 21 ? "mb-3" : ""}>
                    <Message
                      send={Me._id === message.senderId._id}
                      message={message}
                    ></Message></div>
                  )}
                  components={{
                    Footer: () =>
                      typingUser.length > 0 && (
                        <TypingIndicator
                          typingUser={typingUser}
                        ></TypingIndicator>
                      ),
                  }}
                />
              ) : (
                [...Array(10)].map((_, i) => (
                  <MessageSkeleton key={i} send={i % 2 === 0}></MessageSkeleton>
                ))
              )}
            </div>

            <div className="shrink-0 flex flex-col xs:p-2 md:p-4 sticky   bg-white border">
           
             <div className="bottom-0 flex justify-between shrink-0">
              <div className="w-full relative">
               {replyMessage !== null && (
  <div  className={`w-full  shadow-md pl-3 pr-2 py-1 text-md  bg-[#f1f3f7] rounded-sm border-l-4  flex justify-between items-center `} >
    
    <div className="truncate text-gray-600">
      {replyMessage.text} 
    </div>

    <XMarkIcon
      onClick={() => setReplyMessage(null)}
      className="w-4 h-4 cursor-pointer text-gray-400 hover:text-black"
    />
    
  </div>
)}
                <input
                  type="text"
                  onChange={(e) => {
                    handleTyping();
                    handleStopTyping();
                    setSendingMessage(e.target.value);
                  }}
                  className={`bg-[#E6EBF5] rounded-lg shadow-sm outline-none ${replyMessage===null?"h-full":"h-8 md:h-12"} w-full pl-2 `}
                  placeholder={` Enter Message here ...`}
                  value={sendingMessage}
                  name="sendmessageinput"
                  id="sendmessageinput"
                />
              </div>
              <div className=" flex justify-between items-center">
                <div
                  className="p-2.5 px-1 sm:px-2.5  "
                  onClick={() => {
                    document.getElementById("fileMessageInput").click();
                  }}
                >
                  <PaperClipIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB] hidden  cursor-pointer" />
                  <input
                    disabled={true}
                    type="file"
                    id="fileMessageInput"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={fileChangeHandler}
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
                  className="p-2.5  bg-[#6159CB] rounded-full"
                  onClick={handleSendMessage}
                >
                  <PaperAirplaneIcon className=" w-5 h-5 sm:w-6 -rotate-90 sm:h-6 text-white cursor-pointer" />
                </div>
              </div>
</div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyChat></EmptyChat>
      )}

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
                  loading="lazy"
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
                  onClick={handleUploadImage}
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
                  onClick={handleUploadVideo}
                />
              </div>
            )}
        
          </div>
        </div>
      )}
    </>
  );
}
