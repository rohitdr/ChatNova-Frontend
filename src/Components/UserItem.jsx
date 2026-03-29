
import React from "react";
const  UserItem=React.memo(({element,handleUserClick,capitalizeFirstLetter,image,name,lastMessage}) =>{
   const preload=()=>{
  import("./Chatting")
  }
  return (
       <div
                     onMouseEnter={preload}
                     onTouchStart={preload}
                      onClick={() => {
                        handleUserClick(element);
                      }}
                  
                      className="flex shadow  border-2 h-[65px]   cursor-pointer rounded-2xl mt-2 bg-white  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                    >
                      <div className="">
                        
                        <img
                          loading="lazy"
                          className="w-9 min-w-9 min-h-10 mt-1 h-10 rounded-full border-white shadow object-cover"
                          src={image}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col w-full justify-between py-1">
                        <div className="flex  flex-1 justify-between items-center pl-2 ">
                          <p className="font-small text-xs  xs:text-sm text-black">
                            {capitalizeFirstLetter(name)}
                          </p>

                         {lastMessage && <p className=" pt-1 text-[10px] xs:text-xs text-gray-400">
                            {lastMessage.createdAt === null
                              ? ""
                              : new Date(
                                  lastMessage.createdAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                          </p>}
                        </div>
                        {lastMessage && <div className="pl-2  text-[10px] xs:text-sm text-gray-400 flex justify-between truncate">
                          {lastMessage.text}
                        </div>}
                      </div>
                    </div>
  )
})
export default UserItem
