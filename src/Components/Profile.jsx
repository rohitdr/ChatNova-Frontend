import {

  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useContext, useMemo } from "react";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
export default function Profile() {
  const { Me, isServerDown } =  useContext(AuthContext);
  const { capitalizeFirstLetter } = useContext(ChatNovaContext);
const aboutItem =useMemo(()=>[
  {id:1,name:"Name",value:Me?.name},
  {id:2,name:"Email",value:Me?.email},
  {id:3,name:"Username",value:Me?.username},
  {id:4,name:"Phone Number",value:Me?.phone_number},
 
],[Me])
  return isServerDown ? (
    <NoServer />
  ) : (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#EEF2F7] to-[#F8FAFC] overflow-y-auto scrollbar-hide">

    
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          My Profile
        </h2>
      </div>

   
      <div className="mx-4 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <div className="relative">
          <img
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            src={Me?.image?.url ||"https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png"}
            alt="User"
            loading="lazy"
          />
        </div>

        <p className="mt-4 text-lg font-semibold text-gray-800">
          {capitalizeFirstLetter(Me?.name||"")}
        </p>

        <p className="text-sm text-gray-500">@{Me?.username}</p>
      </div>

    
   

   
      <div className="mx-4 mt-4 mb-10 pb-10">
        <div className="flex items-center mb-3 px-1">
          <UserCircleIcon className="w-5 h-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm divide-y">
        {aboutItem.map(({id,name,value})=>(  <div key={id} className="p-4 hover:bg-gray-50 transition">
            <p className="text-xs text-gray-500">{name}</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {value || "Not Provided"}
            </p>
          </div>))}
        
        

        </div>
      </div>
    </div>
  );
}
