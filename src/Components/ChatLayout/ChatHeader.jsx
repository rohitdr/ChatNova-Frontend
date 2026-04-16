
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


export default function ChatHeader({ selectedUser,
  selectedGroup,
  activeGroupChat,
  onlineUsers,
  setActiveChat,
  setActivePage,
  capitalizeFirstLetter,
formatLastSeen,
socket,
conversationId
}) {
  const handleBack=()=>{
  
   if (!socket) return;

 if(conversationId) {
      socket.emit("leave_group",conversationId)
    }
       setActiveChat(false)
  }
  const handleGroupClick=()=>{
  
      if (activeGroupChat) {
                        setActivePage(4);
                        setActiveChat(false);
                      }
  }
     const isOnline=onlineUsers?.includes(selectedUser?._id)
  return (
   
       <div
      
                className="shrink-0 flex items-center justify-between px-3 py-2 lg:px-6 lg:py-3 
bg-white/80 backdrop-blur-md border-b shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeftIcon
                    className="w-6 h-6 text-gray-700 cursor-pointer lg:hidden hover:scale-110 transition"
                    onClick={handleBack}
                  />

                  <div className="relative">
                    <img
                      loading="lazy"
                      className="lg:h-12 lg:w-12 h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                      src={activeGroupChat? 
                        selectedGroup?.avtar?.url || "https://res.cloudinary.com/do2twyxai/image/upload/v1776158903/nqlnpx7qfsdj2mzvdfvt.jpg"
                        : selectedUser?.image?.url || "https://res.cloudinary.com/do2twyxai/image/upload/v1776158903/nqlnpx7qfsdj2mzvdfvt.jpg"
                      }
                     alt={activeGroupChat ? "Group avatar" : selectedUser?.name || "User"}
                    />

                    {!activeGroupChat &&
                      isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                  </div>

                  <div
                    className="flex flex-col cursor-pointer"
                   onClick={handleGroupClick}
                  >
                    <h2 className="text-sm lg:text-lg font-semibold text-gray-900">
                      {capitalizeFirstLetter(
                        activeGroupChat
                          ? selectedGroup?.name
                          : selectedUser?.name,
                      )}
                    </h2>

                    {!activeGroupChat &&
                      ( isOnline? (
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
