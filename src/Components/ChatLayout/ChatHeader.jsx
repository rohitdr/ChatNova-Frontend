
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useConversation } from './../../features/chat/hooks/useConversation';
import ChatHeaderSkeleton from './../ChatHeaderSkeleton';

import { Link } from "react-router-dom";
import useUser from "../../features/users/hooks/useUser";
import captalize from './../../utils/captalise';
export default function ChatHeader({ 
  onlineUsers,
userId,
formatLastSeen,
socket,
conversationId,
currentUser
}) {
const {data:user}=useUser(userId)
  const {data:conversation,isLoading}=useConversation(conversationId)
const otherUser=user?user:conversation?.participents?.find((participent)=>participent.user._id !== currentUser._id)?.user

  const handleBack=()=>{
   if (!socket) return;
 if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
    // setConversationId(null)
    //    setActiveChat(false)
  }
 
     const isOnline=onlineUsers?.includes(otherUser?._id)
     if(isLoading) return <ChatHeaderSkeleton></ChatHeaderSkeleton>
  return (
   
       <div
      
                className="shrink-0 flex items-center justify-between px-3 py-2 lg:px-6 lg:py-3 
bg-white/80 backdrop-blur-md border-b shadow-sm"
              >
                <div className="flex items-center gap-3">
                <Link to={`${conversation?.type==="group"?"/group":"/"}`}>
                  <ArrowLeftIcon
                    className="w-6 h-6 text-gray-700 cursor-pointer lg:hidden hover:scale-110 transition"
                    onClick={handleBack}
                  /></Link>

                  <div className="relative">
                    <img
                      loading="lazy"
                      className="lg:h-12 lg:w-12 h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                      src={conversation?.type==="group"? 
                        conversation?.avtar?.url || "https://res.cloudinary.com/do2twyxai/image/upload/v1776158903/nqlnpx7qfsdj2mzvdfvt.jpg"
                        : otherUser?.image?.url || "https://res.cloudinary.com/do2twyxai/image/upload/v1776158903/nqlnpx7qfsdj2mzvdfvt.jpg"
                      }
                     alt={conversation?.type==="group" ? "Group avatar" : otherUser?.name || "User"}
                    />

                    {conversation?.type==="private" &&
                      isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                  </div>

                  <Link
                    className="flex flex-col cursor-pointer"
                  to={`/group/${conversation?._id}/info`}
                  >
                    <h2 className="text-sm lg:text-lg font-semibold text-gray-900">
                      {captalize(
                        conversation?.type==="group"
                          ? conversation?.name
                          : otherUser?.name,
                      )}
                    </h2>

                    {conversation?.type==="private" &&
                      ( isOnline? (
                        <span className="text-xs text-green-500 font-medium">
                          online
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {formatLastSeen(otherUser?.lastSeen || "")}
                        </span>
                      ))}
                  
                  </Link>
                </div>

{/*             
                <div className="flex items-center gap-4 text-gray-600">
                  <MagnifyingGlassIcon className="w-5 h-5 cursor-pointer hover:text-blue-500 hover:scale-110 transition" />

                  <PhoneIcon className="w-5 h-5 cursor-pointer hover:text-green-500 hover:scale-110 transition" />

                  <VideoCameraIcon className="w-5 h-5 cursor-pointer hover:text-purple-500 hover:scale-110 transition" />

                  <EllipsisVerticalIcon className="w-5 h-5 cursor-pointer hover:text-gray-900 hover:scale-110 transition" />
                </div> */}
              </div>
  
  )
}
