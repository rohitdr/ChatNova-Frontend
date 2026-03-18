import React, { useContext,useState } from "react";
import NoServer from "./NoServer";
import AuthContext from "../Context/AuthContext";
import { MagnifyingGlassIcon,MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import ChatNovaContext from "../Context/ChatNovaContext";
import {

  VideoCameraIcon,
  PhotoIcon,

} from "@heroicons/react/24/solid";

export default function Group() {
  const authcontext = useContext(AuthContext)
const {isServer}=authcontext
const context = useContext(ChatNovaContext)
const {chattedUsersList,capitalizeFirstLetter}=context
 const [searchClick, setSearchClick] = useState(true);
  const onChangeHandler = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setSearchClick(true);
    } else {
      setSearchClick(false);
   
    }
  };
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <> 
     
        <div className="h-screen  2xs:p-0 xs:p-1  lg:p-0 flex bg-[#F5F7FB] flex-col">
          <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">Groups</div>
          <div className="flex p-2 pr-0 rounded-lg border-none mx-2 sm:mx-4 my-2 bg-[#E6EBF5]">
            <MagnifyingGlassIcon className="w-5 h-5 pt-1  text-gray-700 cursor-pointer" />
            <input
              type="search"
              className="w-full  bg-[#E6EBF5] outline-none pl-2"
           onChange={onChangeHandler}
              placeholder="Search messages or users"
              name="usersearch"
              id="usersearch"
            />
          </div>
      

          <div className="flex pt-2 flex-col  sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
         
            {searchClick &&
              chattedUsersList &&
              chattedUsersList.length !== 0 ?
              chattedUsersList.map((element) => {
                return (
                  <div
                  
                    className="flex shadow  border-2   cursor-pointer rounded-2xl mt-2  hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2"
                  >
                    <div className="pt-2">
                      <img
                        className="w-12 h-10 rounded-full border-white border-2"
                        src={element.image.url}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col w-full justify-between py-1">
                      <div className="flex  flex-1 justify-between items-center pl-2 ">
                        <p className="font-small text-xs  xs:text-sm text-black">
                          {capitalizeFirstLetter(element.name)}
                        </p>
                        <p className=" pt-1 text-[10px] xs:text-xs text-gray-400">
                          {element.lastMessageTime === null
                            ? ""
                            : new Date(
                                element.lastMessageTime,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </p>
                      </div>
                      <div className="pl-2  text-[10px] xs:text-sm text-gray-400">
                        {element.lastMessageType =="image"&&  <div className="flex"> <PhotoIcon className="w-3 h-3 text-red-400 mt-1 mr-2 "></PhotoIcon> Photo</div>}
                        {element.lastMessageType =="video"&& <div className="flex"> <VideoCameraIcon className="text-[#6159CB] w-3 h-3 mt-1 mr-2"></VideoCameraIcon>Video</div>}
                        { element.lastMessageType=="text" && element.lastMessage === null
                          ? ""
                          : element.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              }):
              <div className="flex h-screen justify-center items-center">
                <div className="text-center flex flex-col"> <div className="flex justify-center"> <MagnifyingGlassCircleIcon className="h-12 w-12 text-gray-600"></MagnifyingGlassCircleIcon></div><div>Search User to chat With...</div> </div>
              </div>
              
              }
          </div>
        </div>
      )
 
    </>
  );
}
