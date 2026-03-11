import React from 'react'
import { PhoneIcon,EllipsisVerticalIcon,MagnifyingGlassIcon,VideoCameraIcon, FaceSmileIcon, PaperClipIcon  } from "@heroicons/react/24/outline";
import {  PaperAirplaneIcon  } from "@heroicons/react/24/solid";
export default function Chatting() {
  return (
    <div className='h-screen bg-white'>
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-row p-7 border justify-between'>

        <div className='flex items-center justify-between'>
        <img className='h-10 w-10 rounded-full' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
        <h2 className='mx-4 pb-1 text-xl'>Rohit Kumar</h2>

        </div>
        <div className='flex  items-center justify-between'>
           <div className='mx-4'>
           <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

          </div>
          <div className='mx-4'>

           <PhoneIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>
          <div className='mx-4'>
           <VideoCameraIcon className="w-5 h-5 text-gray-700 cursor-pointer" />

          </div>
         
          <div className='mx-4'>

           <EllipsisVerticalIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
          </div>

           </div>
      </div>
      <div className=''></div>
      <div className='flex p-7 justify-between bg-white border'>

 <div className='w-full'> 
  <input type="text" className='bg-[#E6EBF5] rounded-md h-full w-full pl-2 ' placeholder='Enter Message...' name="" id="" />
  </div> 
 <div className=' flex justify-between'> 
  <div className='p-2.5'>

  <FaceSmileIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />
  </div>
  <div className='p-2.5'>
  <PaperClipIcon className="w-6 h-6 text-[#6159CB]  cursor-pointer" />

  </div>
  <div className='p-2.5 bg-[#6159CB] rounded-lg'>
  <PaperAirplaneIcon className="w-6 h-6 text-white cursor-pointer" />

  </div>
  </div> 

        
      </div>
    </div>
    </div>
  )
}

