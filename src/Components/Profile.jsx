import {
  ArrowUpIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";

import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
export default function Profile() {
  const authContext = useContext(AuthContext);
  const { user, isServer } = authContext;
  const { capitalizeFirstLetter } = useContext(ChatNovaContext);

  return isServer === 500 ? (
    <NoServer />
  ) : (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] overflow-y-auto scrollbar-hide">

    
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          My Profile
        </h2>
        <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
      </div>

   
      <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <div className="relative">
          <img
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            src={user?.image?.url}
            alt=""
            loading="lazy"
          />
        </div>

        <p className="mt-4 text-lg font-semibold text-gray-800">
          {capitalizeFirstLetter(user?.name)}
        </p>

        <p className="text-sm text-gray-500">@{user?.username}</p>
      </div>

    
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-5 text-sm text-gray-600 ">
        Hey! I love connecting with new people and having meaningful
        conversations. Feel free to drop a message anytime!
      </div>

      {/* About Section */}
      <div className="mx-4 mt-4 mb-10 pb-10">
        <div className="flex items-center mb-3 px-1">
          <UserCircleIcon className="w-5 h-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm divide-y">

          <div className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {user?.name}
            </p>
          </div>

          <div className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {user?.email}
            </p>
          </div>

          <div className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">Username</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {user?.username}
            </p>
          </div>

          <div className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {user?.phone_number}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
