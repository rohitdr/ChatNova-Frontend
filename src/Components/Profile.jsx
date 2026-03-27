import {
  ArrowUpIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
export default function Profile() {
  const authContext = useContext(AuthContext);
  const { user, isServer } = authContext;
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <div className="flex h-full flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">
      <div className="flex justify-between m-2 p-2 mt-4">
        <div>
          {" "}
          <h2 className="text-2xl pt-2 font-medium">My Profile</h2>{" "}
        </div>
        <div className="pt-2">
          {" "}
          <EllipsisVerticalIcon className="w-7 h-7 text-gray-700 cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center my-2">
        <div className="my-2 py-2">
          <img
        
            className="w-28  h-28 rounded-full  border-white border-4"
            src={user?.image.url}
            alt=""
            loading="lazy"
          />
        </div>
        <p className="my-2 mb-1 font-medium">{user?.name}</p>
        <p>Active</p>
      </div>
      <div className="my-3 py-3 mx-3 px-2 text-sm text-[#8E949D]">
      Hey! I love connecting with new people and having meaningful conversations.
Feel free to drop a message anytime!
      </div>
      <div className="flex flex-col mx-3 mb-20">
        <div className="flex justify-between">
        <div className="flex font-medium bg-[#F9FAFA] pt-2 pb-3">
          {" "}
          <UserCircleIcon className="w-5 font-medium mt-1.5  mx-2 h-5 text-black" />
          <div className=" text-xl"> About</div></div>
          {/* <div className="p-2 pt-3"><ChevronUpIcon className="h-5 w-5 "></ChevronUpIcon></div> */}
          </div>
        
        <div className="flex flex-col mx-0.5 mb-2 py-3 bg-[#FFFFFF]">
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A] ">Name</div> <div className="text-sm py-1 font-medium">{user?.name}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Email</div> <div className="text-sm py-1 font-medium">{user?.email}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Username</div> <div className="text-sm py-1 font-medium">{user?.username}</div></div>
            <div className="flex flex-col py-2 px-6"> <div className=" text-[#7A7F9A]">Phone Number</div> <div className="text-sm py-1 font-medium">{user?.phone_number}</div></div>
          
          
          
          </div>
      </div>
    </div>
  );
}
