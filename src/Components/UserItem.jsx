/**
 * The `UserItem` component in JavaScript React is a memoized functional component that renders a user
 * item with specified props and event handlers.
 */
import React, { useCallback, useContext } from "react";
import ChatNovaContext from "../Context/ChatNovaContext";
import { PlusIcon, MinusIcon, CheckIcon } from "@heroicons/react/24/solid";

const UserItem = React.memo(
  ({
    user,
    handleUserClick,
    isSelected=false,
    onAdd,
    onRemove,
    showActions=false,
    mode="chat"
  }) => {


    const {image,lastMessage,name,element,unreadCount} =user
    const preload = useCallback(() => {
      import("./ChatLayout");
    },[]);
    const handleClick = ()=>{
      if(mode === "chat"){

        handleUserClick(element);
      }
    }
    const {capitalizeFirstLetter} = useContext(ChatNovaContext)
    const time = lastMessage?.createdAt
  ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "";
    return (
      <div
        onMouseEnter={preload}
        onTouchStart={preload}
        onClick={handleClick}
        className={`flex border-2 h-[65px] cursor-pointer rounded-2xl my-2 p-2 transition ${
          isSelected
            ? "bg-blue-50 border-blue-400"
            : "bg-white hover:bg-[#E6EBF5]"
        }`}
      >
        <div className="">
          <img
            loading="lazy"
            className="w-9 min-w-9 min-h-10 mt-1 h-10 rounded-full border-white shadow object-cover"
            src={image}
            alt={name}
          />
        </div>
        <div>
          
        </div>
        
        <div className="flex flex-col w-full justify-between py-1">
          <div className="flex  flex-1 justify-between items-center pl-2 ">
            <p className="font-small text-xs  xs:text-sm text-black">
              {capitalizeFirstLetter(name)}
            </p>

            { mode ==="chat" &&lastMessage && (
              <p className=" pt-1 text-[10px] xs:text-xs text-gray-400 flex col">
                { time}
                
              </p>
            )}
          </div>
          <div className="flex justify-between">
            
          { mode === "chat" &&lastMessage && (
            <div className="pl-2  text-[10px] xs:text-sm text-gray-400 flex justify-between truncate">
              {lastMessage.text}
            </div>
          )}
         
           {unreadCount!==0 && unreadCount && <p className="2xs:mx-2  xs:mx-6 text-[10px] bg-green-500 rounded-full h-4 w-4 text-white bg xs:text-xs flex items-center justify-center">
               {unreadCount}
         
              </p>}
        </div></div>
             {showActions && (
          <div className="flex items-center gap-2 ml-2">
            {!isSelected ? (
              <PlusIcon
                className="w-5 h-5 text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.(user._id);
                }}
              />
            ) : (
              <>
                <CheckIcon className="w-5 h-5 text-blue-500" />
                <MinusIcon
                  className="w-5 h-5 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(user._id);
                  }}
                />
              </>
            )}
          </div>
        )} </div>

   
    );
  },
);
UserItem.displayName="UserItem"
export default UserItem;
