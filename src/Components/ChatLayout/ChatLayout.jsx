import  { useContext, useEffect, useMemo, useState } from "react";

import ChatNovaContext from "../../Context/ChatNovaContext";
import { useRef } from "react";
import SocketContext from "../../Context/SocketContext";
import AuthContext from "../../Context/AuthContext";

import EmptyChat from "../EmptyChat";

import ChatHeaderSkeleton from "../ChatHeaderSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import useMessage from "../Hooks/useMessage";
import useSocket from "./Hooks/useSocket";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import MediaModal from "./MediaModal";
import useTyping from "./Hooks/useTyping";
import useSendMessage from "./Hooks/useSendMessage";

export default function ChatLayout() {
    
  const [sendingMessage, setSendingMessage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const { showAlert, setActivePage,Me } = useContext(AuthContext);
const isPaginationRef=useRef(false)

  const [mediaSendModal, setMediaSendModal] = useState(false);
  const [typingUser, setTypingUser] = useState([]);


  const {

setReplyMessage,
    replyMessage,
      selectedUser,
      selectedUserLoading,
    setActiveChat,
    uploadCloudinary,
    currentChatUserId,
 
getmessages,
    sendMessages,
  
    capitalizeFirstLetter,
    conversationId,
    firstItemIndexRef,
    activeGroupChat,
selectedGroup,

  } =  useContext(ChatNovaContext);
  
  const {data,isLoading,fetchNextPage}=useMessage(conversationId,getmessages) 
const messages = useMemo(() => {
  return data?.pages.flatMap(page => page.message).reverse() || [];
}, [data]);
const totalCount = data?.pages.reduce((acc, page) => acc + page.message.length, 0) || 0;
const queryclient = useQueryClient();

  const { socket, onlineUsers } =  useContext(SocketContext);

const virtuosoRef =useRef(null)

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
}, [conversationId,queryclient]);



useEffect(()=>{
   virtuosoRef.current?.scrollToIndex({
      index: 100005,
      behavior: "smooth",
    });
},[typingUser])





 useSocket({
    socket,
  conversationId,
  queryclient,
  Me,
  setTypingUser,
 })




  const imagechangehandler = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    if (file.size > 10*1024*1024) {
      showAlert("Error", "Image size should be less than 10 mb");
      e.target.value = null;
    } else {
      setMediaSendModal(true);
      setUploadedImage(e.target.files[0]);
      e.target.value = null;
    }
  };
  const videochangehandler = (e) => {
        const file = e.target.files?.[0]
    if(!file) return
    if (e.target.files[0].size > 10*1024*1024) {
      showAlert("Error", "Video size should be less than 10 mb");
      e.target.value = null;
    } else {
      setMediaSendModal(true);
      setUploadedVideo(e.target.files[0]);
      e.target.value = null;
    }
  };
 
const {
    createSendMessage,
    createUploadImage,
    createUploadVideo
   }=useSendMessage({queryclient,uploadCloudinary,conversationId,sendingMessage,Me,replyMessage,uploadedImage,uploadedVideo,sendMessages,currentChatUserId})

  const handleSendMessage = () => {
   createSendMessage()
 virtuosoRef.current?.scrollToIndex({
      index: 100000,
      behavior: "smooth",
    });
      setSendingMessage("");
      setReplyMessage(null)
    }


  const handleUploadImage = () => {
   createUploadImage()
    virtuosoRef.current?.scrollToIndex({
      index: 100000,
      behavior: "smooth",
    });
    setMediaSendModal(false);
     setUploadedImage(null);
  };

  const handleUploadVideo = () => {
 createUploadVideo()
  virtuosoRef.current?.scrollToIndex({
      index: 100000,
      behavior: "auto",
  });
    setMediaSendModal(false);
    setUploadedVideo(null)
  };
 const {
    handleTyping,
    handleStopTyping

  }=useTyping({socket, Me, conversationId })


 const handleRangeChange=async(range) => {
                    const isAtTop =
                      range.startIndex<(100005-(totalCount))

                    if (isAtTop) {
                        // isPaginationRef.current= true
                 fetchNextPage()
  //                setTimeout(() => {
  //   isPaginationRef.current = false;
  // }, 1000);

                    }
                  }
  const formatLastSeen = (time) => {
    const now = new Date();
    const last = new Date(time);
    let diff = Math.floor((now - last) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `Active ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return ` Active ${Math.floor(diff / 3600)} hr ago`;

    return last.toLocaleDateString("en-GB");
  };
  return  (
    <>  
      {currentChatUserId || activeGroupChat ? (
        <div className={`h-[100dvh] md:h-screen bg-white overflow-hidden`}>
          <div className="flex h-full flex-col ">
            {!selectedUserLoading  || messages.length!==0 ? (
                <ChatHeader  selectedUser={selectedUser}
  selectedGroup={selectedGroup}
  activeGroupChat={activeGroupChat}
  onlineUsers={onlineUsers}
  setActiveChat={setActiveChat}
  setActivePage={setActivePage}
  capitalizeFirstLetter={capitalizeFirstLetter}
  formatLastSeen={formatLastSeen}
  socket={socket}
  conversationId={conversationId} ></ChatHeader>
//           
            ) : (
              <ChatHeaderSkeleton></ChatHeaderSkeleton>
            )}
          
            <MessageList
             messages={messages}
  isLoading={isLoading}
  virtuosoRef={virtuosoRef}
  totalCount={totalCount}
  handleRangeChange={handleRangeChange}
  firstItemIndexRef={firstItemIndexRef}
  Me={Me}
  typingUser={typingUser}></MessageList>

            <div className="shrink-0 flex flex-col xs:p-2 md:p-4    bg-white border">
           
      <ChatInput
  messageState={{
    sendingMessage,
    setSendingMessage,
    replyMessage,
    setReplyMessage,handleSendMessage
  }}
  typingHandlers={{
    handleTyping,
    handleStopTyping
  }}
  mediaHandlers={{
    videochangehandler,
    imagechangehandler,
  }}
 
/>
            </div>
          </div>
        </div>
      ) : (
        <EmptyChat></EmptyChat>
      )}

      {mediaSendModal && (
        
      <MediaModal
    setMediaSendModal={setMediaSendModal}
    uploadedVideo={uploadedVideo}
    uploadedImage={uploadedImage}
    setUploadedImage={setUploadedImage}
    setUploadedVideo={setUploadedVideo}
    handleUploadImage={handleUploadImage}
    handleUploadVideo={handleUploadVideo}
  />
      )}
    </>
  );
}
