import React, { useContext, useState } from 'react'
import { UserCircleIcon,ChatBubbleLeftRightIcon,Cog6ToothIcon,UserGroupIcon,PowerIcon  } from "@heroicons/react/24/outline";
import AuthContext from '../Context/AuthContext';

export default function SideBar() {
    const  context = useContext(AuthContext)
    const {logout}=context
  const [profileOptionsActive,setProfileOptionsActive]=useState(false)
  const logoutHandler=()=>{
 logout()
  }
  return (
   <>
   <div className=' 2xs:h-14 xs:h-16 lg:h-full lg:grid lg:grid-rows-[35%_30%_35%] lg:static bg-white fixed bottom-0 left-0 right-0 flex  justify-between lg:justify-center  ' >
     <div className='flex items-start lg:items-start  mt-4 lg:justify-center lg:mb-2 justify-start'>

   <img src="https://res.cloudinary.com/do2twyxai/image/upload/v1773486472/ChatGPT_Image_Mar_14_2026_04_35_32_PM_owgv9l.png" alt="" className=' lg:h-10 lg:w-14 xs:w-10 xs:pb-1 h-8  w-8 xs:ml-5  2xs:ml-3 2xs:h-7 2xs:w-7  lg:mx-0 rounded-full' />
   </div>
   <div className='flex lg:h-[20rem] h-full flex-row lg:flex-col items-center justify-between'>
    <div className='hover:bg-red-600'>    <UserCircleIcon className="md:w-9 w-7 h-7 sm:ml-12 lg:w-9 lg:h-9 lg:mb-4 mx-4 lg:mx-2 md:h-9 text-black" /></div>
    <div> <ChatBubbleLeftRightIcon className="lg:w-9 sm:ml-12 w-7 h-7 md:w-9 md:h-9 2xs:mx-2 xs:mx-4 lg:my-2 lg:mx-2 lg:h-9 text-black" /></div>
    <div> <UserGroupIcon className="lg:w-9  w-7 md:w-9 lg:my-2 h-7 md:h-9 sm:ml-12 lg:h-9 mx-4 lg:mx-2 text-black" /></div>
    <div> <Cog6ToothIcon className="lg:w-9 md:w-9 w-7 sm:ml-12 lg:my-6 h-7 md:h-9 2xs:mx-2 2xs:mt-0 xs:mx-4 lg:mx-2 lg:h-9 text-black" /></div>
 
   




   </div>
   <div className='flex items-end lg:items-end lg:justify-center mb-4  justify-end '>

   <img onClick={()=>{profileOptionsActive?setProfileOptionsActive(false):setProfileOptionsActive(true)}} src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" className=' 2xs:h-7 2xs:w-7 border-black cursor-pointer border-2 2xs:mr-2 xs:mr-5 lg:mx-0 lg:h-10 lg:w-10 h-8 w-8 xs:mb-1 rounded-full' />
   </div>

   </div>


   {profileOptionsActive &&  <div className='fixed inset-0 bg-black/20 ' onClick={()=>{setProfileOptionsActive(false)}}> 
    <div className='fixed shadow-xl   bg-white h-44 w-44 bottom-14 right-4 lg:bottom-14 lg:left-4' onClick={(e)=>{e.stopPropagation()}}>
    <div className=' cursor-pointer'>
   <div className='border   border-gray-50 hover:bg-slate-100'>

    <div className='flex m-4  mb-4 text-gray-700 justify-between font-medium'><div>Profile</div> <div><UserCircleIcon  className="w-4 h-4 mt-1.5 text-black cursor-pointer" /></div></div>
    </div>
     <div className='border   cursor-pointer border-gray-50  hover:bg-slate-100'>

    <div className='flex m-4  mb-4 text-gray-700 justify-between font-medium'><div>Settings</div> <div><Cog6ToothIcon  className="w-4 h-4 mt-1.5 text-black cursor-pointer" /></div></div>
    </div>
    
    </div>
    <div className='border  cursor-pointer  border-gray-50 border-t-gray-300 hover:bg-slate-100' onClick={logoutHandler}>

    <div className='flex m-4  mb-4 text-gray-700 justify-between font-medium'><div>Log Out</div> <div><PowerIcon  className="w-4 h-4 mt-1.5 text-black cursor-pointer" /></div></div>
    </div>
   
   </div>
   </div> }
   </>
  )
}
