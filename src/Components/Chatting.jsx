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
export default function Chatting() {
  const [sendingMessage, setSendingMessage] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadVideo, setUploadedVideo] = useState(null);
  const [uploadFile, setUplaodFile] = useState(null);
  const Context = useContext(ChatNovaContext);
  const authContext = useContext(AuthContext);
  const { user, isServer, loadingMessages, showAlert, setActivePage } =
    authContext;
  const [fileType, setFileType] = useState(null);

  const [mediaSendModal, setMediaSendModal] = useState(false);
  const [typingUser, setTypingUser] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const {
    currentChatUser,
    setActiveChat,
    uploadCloudinary,
    currentChatUserId,
    setChattedUsersList,
    getmessages,
    currentUsersMessages,
    chattedUsers,
    setCurrentUsersMessages,
    sendMessages,
    isInitailLoadRef,
    capitalizeFirstLetter,
    conversationId,
    firstItemIndexRef,
    activeGroupChat,

    currentGroup,
    activeChat,
    page,
    hasMoreRef,
    loadingRef,
    loadMoreMessages,
  } = Context;
  const socketcontext = useContext(SocketContext);
  const { socket, onlineUsers } = socketcontext;
  const virtuosoRef = useRef(null);
  useEffect(() => {
    if (!socket) return;
    const handler = ({ messageId, reaction }) => {
      console.log("handler");
      setCurrentUsersMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reaction: reaction } : msg,
        ),
      );
    };
    socket.on("reaction_updated", handler);

    return () => {
      socket.off("reaction_updated", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const deliverHandler = ({ messageId, deliveredTo }) => {
      setCurrentUsersMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deliveredTo: deliveredTo } : msg,
        ),
      );
    };

    socket.on("message_deliverd", deliverHandler);

    return () => {
      socket.off("message_deliverd", deliverHandler);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    const seenHandler = ({ messageId, seenBy }) => {
      setCurrentUsersMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seenBy: seenBy } : msg,
        ),
      );
    };

    socket.on("message_seen", seenHandler);

    return () => {
      socket.off("message_seen", seenHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (currentUsersMessages.length && isInitailLoadRef.current) {
      virtuosoRef.current?.scrollToIndex({
        index: currentUsersMessages.length - 1,
        behavior: "auto",
      });
      isInitailLoadRef.current = false;
    }
  }, []);
  useEffect(() => {
    virtuosoRef.current?.scrollToIndex({
      index: currentUsersMessages.length - 1,
      behavior: "auto",
    });
  }, [typingUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        (activeGroupChat &&
          newMessage._doc.conversationId === conversationId) ||
        (!activeGroupChat && newMessage._doc.conversationId === conversationId)
      ) {
        console.log("running");
        socket.emit("mark_seen", {
          conversationId: conversationId,
          userId: user._id,
        });

        /// setting current user chat
        setCurrentUsersMessages((prev) => {
          if (!prev) return [newMessage._doc];

          const exists = prev.some((msg) => msg._id === newMessage.tempId);
          if (exists) {
            return prev.map((m) =>
              m._id === newMessage.tempId ? newMessage._doc : m,
            );
          }

          const audio = new Audio(
            "/universfield-happy-message-ping-351298.mp3",
          );
          audio.play().catch((err) => console.log("Audio play error:", err));

          return [...prev, newMessage._doc];
        });
      }

      //setting current user list
      setChattedUsersList((prev) => {
        const index = prev.findIndex(
          (c) => c.ConversationId === newMessage._doc.conversationId,
        );
        console.log(index);
        const lastMessage = {
          text: newMessage._doc.text,
          createdAt: newMessage._doc.createdAt,
        };
        if (index === -1) {
          const newuser = newMessage.conversationToSend.participents.find(
            (p) => p.user._id !== user._id,
          );
          console.log({
            ConversationId: newMessage.conversationToSend.ConversationId,
            lastMessage: newMessage.conversationToSend.lastMessage,
            user: newuser,
          });
          return [
            {
              ConversationId: newMessage.conversationToSend.ConversationId,
              lastMessage: newMessage.conversationToSend.lastMessage,
              user: newuser.user,
            },
            ...prev,
          ];
        }
        const updateduserlist = {
          ...prev[index],
          lastMessage,
        };
        const filtereduser = prev.filter(
          (c) => c.ConversationId !== newMessage._doc.conversationId,
        );

        return [updateduserlist, ...filtereduser];
      });
      // updatedUserList(currentChatUser)
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

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
  const handleSendMessage = () => {
    if (sendingMessage !== "") {
      const tempmessage = {
        _id: Date.now(),
        type: "text",
        text: sendingMessage,
        createdAt: Date.now(),
        senderId: {
          _id: user._id,
          image: {
            url: user.image?.url,
          },
        },
      };

      activeGroupChat
        ? sendMessages({
            conversationId: conversationId,
            message: sendingMessage,
            tempId: tempmessage._id,
          })
        : sendMessages({
            receiverId: currentChatUserId,
            message: sendingMessage,
            tempId: tempmessage._id,
          });
      setCurrentUsersMessages((prev) => [...prev, tempmessage]);

      setSendingMessage("");
      setChattedUsersList((prev) => {
        const index = prev.findIndex((c) => c.user._id === currentChatUserId);

        const lastMessage = {
          text: tempmessage.text,
          createdAt: tempmessage.createdAt,
        };
        if (index === -1) return prev;
        const updateduserlit = {
          ...prev[index],
          lastMessage,
        };
        const filtereduser = prev.filter(
          (c) => c.user._id !== currentChatUserId,
        );
        console.log([updateduserlit, ...filtereduser]);
        return [updateduserlit, ...filtereduser];
      });
    }
    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: currentUsersMessages.length - 1,
        align: "end",
        behavior: "auto",
      });
    }, 0);
  };
  const virtusoStartReached = () => {
    if (conversationId) {
      console.log("run");
      loadMoreMessages(conversationId, page);
    }
  };
  const handleUploadImage = () => {
    const tempmessage = {
      _id: Date.now(),
      type: "image",
      text: "New Photo",
      createdAt: Date.now(),
      senderId: {
        _id: user._id,
        image: {
          url: user.image?.url,
        },
      },
      media: {
        url: URL.createObjectURL(uploadedImage),
      },
    };
    setCurrentUsersMessages((prev) => [...prev, tempmessage]);
    setChattedUsersList((prev) => {
      const index = prev.findIndex((c) => c.user._id === currentChatUserId);

      const lastMessage = {
        text: tempmessage.text,
        createdAt: tempmessage.createdAt,
      };
      if (index === -1) return prev;
      const updateduserlit = {
        ...prev[index],
        lastMessage,
      };
      const filtereduser = prev.filter((c) => c.user._id !== currentChatUserId);
      console.log([updateduserlit, ...filtereduser]);
      return [updateduserlit, ...filtereduser];
    });
    uploadCloudinary(conversationId, uploadedImage, tempmessage._id);
    setMediaSendModal(false);
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
        _id: user._id,
        image: {
          url: user.image?.url,
        },
      },
      media: {
        url: URL.createObjectURL(uploadVideo),
      },
    };
    setCurrentUsersMessages((prev) => [...prev, tempmessage]);
    setChattedUsersList((prev) => {
      const index = prev.findIndex((c) => c.user._id === currentChatUserId);

      const lastMessage = {
        text: tempmessage.text,
        createdAt: tempmessage.createdAt,
      };
      if (index === -1) return prev;
      const updateduserlit = {
        ...prev[index],
        lastMessage,
      };
      const filtereduser = prev.filter((c) => c.user._id !== currentChatUserId);
      console.log([updateduserlit, ...filtereduser]);
      return [updateduserlit, ...filtereduser];
    });
    uploadCloudinary(conversationId, uploadVideo, tempmessage._id);
    setMediaSendModal(false);
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId,
        userId: user._id,
        name: user.name,
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
        userId: user._id,
        name: user.name,
      });
    }, 1500);
  };
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <>
      {currentChatUserId || activeGroupChat ? (
        <div className={`h-dvh bg-white`}>
          <div className="flex h-full flex-col justify-between">
            {!loadingMessages ? (
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
                          ? currentGroup?.avtar?.url
                          : currentChatUser?.image.url
                      }
                      alt=""
                    />

                    {!activeGroupChat &&
                      onlineUsers?.includes(currentChatUser?._id) && (
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
                          ? currentGroup?.name
                          : currentChatUser?.name,
                      )}
                    </h2>

                    {!activeGroupChat &&
                      (onlineUsers?.includes(currentChatUser?._id) ? (
                        <span className="text-xs text-green-500 font-medium">
                          online
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {formatLastSeen(currentChatUser?.lastSeen || "")}
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
              className={` px-3 sm:px-6  scrollbar-hide flex-1 min-h-0 pb-1 ${loadingMessages && " overflow-y-auto "} `}
            >
              {!loadingMessages ? (
                <Virtuoso
                  className="scrollbar-hide"
                  startReached={virtusoStartReached}
                  computeItemKey={(index, message) => message._id}
                  firstItemIndex={firstItemIndexRef.current}
                  initialTopMostItemIndex={
                    currentUsersMessages.length > 0
                      ? currentUsersMessages.length - 1
                      : undefined
                  }
                  style={{ height: "100%" }}
                  increaseViewportBy={{ top: 500, bottom: 300 }}
                  data={currentUsersMessages}
                  followOutput="auto"
                  rangeChanged={(range) => {
                    const isAtTop =
                      range.startIndex <= firstItemIndexRef.current + 2;

                    if (isAtTop) {
                      virtusoStartReached();
                    }
                  }}
                  itemContent={(index, message) => (
                    <Message
                      send={user._id === message.senderId._id}
                      message={message}
                    ></Message>
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

            <div className="shrink-0 flex xs:p-2 md:p-4 sticky bottom-0 justify-between bg-white border">
              <div className="w-full ">
                <input
                  type="text"
                  onChange={(e) => {
                    handleTyping();
                    handleStopTyping();
                    setSendingMessage(e.target.value);
                  }}
                  className="bg-[#E6EBF5] rounded-full outline-none  h-full w-full pl-2 "
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
            {/* {uploadFile && (
              <div className="">
                {" "}
               {fileType==="pdf" &&  <iframe className="h-screen w-screen" src={URL.createObjectURL(uploadFile)}></iframe>
               }
                {fileType==="docx" &&  <iframe
  src={`https://view.officeapps.live.com/op/embed.aspx?src=${URL.createObjectURL(uploadFile)}`}
  width="100%"
  height="500px">
</iframe>
               }
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
            )} */}
          </div>
        </div>
      )}
    </>
  );
}
