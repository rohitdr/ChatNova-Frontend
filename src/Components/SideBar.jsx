import React from 'react'
import { UserCircleIcon,ChatBubbleLeftRightIcon,Cog6ToothIcon,UserGroupIcon } from "@heroicons/react/24/outline";

export default function SideBar() {
  return (
   <>
   <div className=' bg-white py-2 lg:p-0 grid border border-emerald-200 lg:h-screen lg:grid-cols-1 grid-cols-[35%_30%_35%] lg:grid-rows-[35%_30%_35%] '>
     <div className='flex items-start lg:items-start lg:mt-2 mt-0 lg:justify-center lg:mb-2 justify-start'>

   <img src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" className=' lg:h-10 lg:w-10 h-8 w-8 rounded-full' />
   </div>
   <div className='flex  flex-row lg:flex-col items-center justify-between'>
    <div>    <UserCircleIcon className="w-7  mx-2 h-7 text-black" /></div>
    <div> <ChatBubbleLeftRightIcon className="w-7 mx-2 h-7 text-black" /></div>
    <div> <UserGroupIcon className="w-7 h-7 mx-2 text-black" /></div>
    <div> <Cog6ToothIcon className="w-7 mx-2 h-7 text-black" /></div>
 





   </div>
   <div className='flex items-end lg:items-end lg:justify-center lg:mb-2 justify-end'>

   <img src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" className=' lg:h-10 lg:w-10 h-8 w-8 rounded-full' />
   </div>
   </div>
   </>
  )
}
