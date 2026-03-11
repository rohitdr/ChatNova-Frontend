import React from 'react'
import {  MagnifyingGlassIcon  } from "@heroicons/react/24/solid";
export default function Users() {
  return (
    <div className='h-screen flex bg-[#F5F7FB] flex-col'>
      
      <div className="m-2 p-2 text-3xl font-medium">
       Chats
      </div>
      <div className="flex p-2 rounded-lg border-none mx-4 my-2 bg-[#E6EBF5]">
           <MagnifyingGlassIcon className="w-5 h-5 pt-1 text-gray-700 cursor-pointer" />

<input type="search" className="w-full  bg-[#E6EBF5] outline-none pl-2" placeholder="Search messages or users"name="" id="" />

      </div>
      <div className='flex h-32 justify-evenly overflow-x-auto overflow-y-hidden scrollbar-hide'>
        <div className="p-2 mx-3">

      <div>
        <img className='w-10  h-10 rounded-full' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p className=' '>Rohit</p>
      </div>
        </div>
        <div className=" mx-3 p-2">

      <div>
        <img className='w-10  h-10 rounded-full' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='  w-10 h-10 rounded-full' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='w-10 h-10 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='w-10 h-10 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='w-10 h-10 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='w-10 h-10 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
        <div className="mx-3 p-2">

      <div>
        <img className='w-10 h-10 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p>Rohit</p>
      </div>
        </div>
      </div>
      <div className="px-5 py-3 text-xl font-medium">
     Recent

      </div>
      <div className="flex flex-col p-2 px-4 overflow-y-auto scrollbar-hide">
      {/* first row */}
      <div className='flex  hover:bg-[#E6EBF5] p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
    {/* second row */}
  <div className='flex  p-2  hover:bg-[#E6EBF5]'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
    {/* third row */}
  <div className='flex  p-2 hover:bg-[#E6EBF5]'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
      {/* fourth row
       */}
         <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* fifthe row4 */}
  <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* sixt row */}
         <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* seventh row */}
         <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* eight row  */}
         <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* ningth row  */}
         <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
       {/* tentght row
        */}
          <div className='flex  p-2'>
     <div className='pt-2'>
         <img className='w-9 h-8 rounded-full ' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
        Patrick Hendricks
      </p>
      <p className=' pt-1 text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
      </div>
    </div>
  )
}
