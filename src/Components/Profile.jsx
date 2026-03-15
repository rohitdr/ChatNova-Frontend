
import { EllipsisVerticalIcon,UserCircleIcon  } from "@heroicons/react/24/solid";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
export default function Profile() {
  const authContext = useContext(AuthContext)
  const {user} = authContext
  return (
    <div className='flex h-full flex-col bg-[#F5F7FB]'>
      <div className='flex justify-between m-2 p-2 mt-4'>
        <div> <h2 className="text-2xl pt-2 font-medium">My Profile</h2> </div>
         <div className="pt-2">   <EllipsisVerticalIcon className="w-7 h-7 text-gray-700 cursor-pointer" /></div>
      </div>
      <div className="flex flex-col items-center justify-center my-2">
           <div className="my-2 py-2">
        <img className='w-28  h-28 rounded-full  border-white border-4' src={user?.image.url} alt="" />
      </div>
      <p className="my-2 mb-1 font-medium">{user?.name}</p>
      <p>Active</p>
      </div>
      <div className="my-3 py-3 mx-3 px-2 text-sm text-[#8E949D]">
        Lorem ipsum dolor o aut quis laboriosam esse incidunt assumenda distinctio obcaecati eligendi ullam dolorum quibusdam, accusamus deserunt!
      </div>
      <div className="flex flex-col mx-3">
          <div className="flex font-medium bg-[#F9FAFA] pt-2 pb-3">    <UserCircleIcon className="w-5 font-medium mt-1.5  mx-2 h-5 text-black" /><div className=" text-xl">  About</div></div>

      </div>
    </div>
  )
}
