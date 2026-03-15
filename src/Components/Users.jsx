import React, { useContext, useEffect, useState } from 'react'
import {  MagnifyingGlassIcon  } from "@heroicons/react/24/solid";

import ChatNovaContext from '../Context/ChatNovaContext';
export default function Users() {
  const context=useContext(ChatNovaContext)
  const {serchUser,dataBaseUsers,setChattedUsersList,setActiveChat,getCureentChattingUser,chattedOnlineUsers,getmessages,chattedUsersList,chattedUsers,currentChatUserId,setCurrentChatUserId,capitalizeFirstLetter}=context
  const [searchClick,setSearchClick]=useState(true)

useEffect(()=>{
chattedUsers()

},[])


  const onChangeHandler=(e)=>{
    let value =e.target.value

    if(value.length===0){
setSearchClick(true)
    }else{
setSearchClick(false)
serchUser(value)
    }
   
  }
  return (
    <div className='h-screen 2xs:p-0 xs:p-1  lg:p-0 flex bg-[#F5F7FB] flex-col'>
      <div className="m-2 p-2 xs:p-0 text-3xl  font-medium">
       Chats
      </div>
      <div className="flex p-2 pr-0 rounded-lg border-none mx-2 sm:mx-4 my-2 bg-[#E6EBF5]">
           <MagnifyingGlassIcon  className="w-5 h-5 pt-1  text-gray-700 cursor-pointer"/>
<input type="search" className="w-full  bg-[#E6EBF5] outline-none pl-2" onChange={onChangeHandler} placeholder="Search messages or users" name="usersearch" id="usersearch" />


      </div>
      {/* online users  */}
      {/* {searchClick && <div className='flex h-20 justify-evenly overflow-x-auto overflow-y-hidden scrollbar-hide'>
        {searchClick && chattedOnlineUsers && chattedOnlineUsers.length!==0 && chattedOnlineUsers.map((element)=>{ return <div onClick={()=>{setCurrentChatUserId(element._id);getCureentChattingUser(element._id);setActiveChat(true)}} className="p-2 pb-0 shadow cursor-pointer rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5]  mx-3">

      <div>
        <img className='w-12  h-10 rounded-full border-white border-2' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
      </div>
      <div>
        <p className=' '> {capitalizeFirstLetter(element.name)}</p>
      </div> 
        </div>})}

      </div>} */}
       {/* {searchClick && <div className="px-5 py-2 text-xl font-medium">
     Recent
      </div>} */}
      <div className="flex pt-2 flex-col sm:p-2 sm:px-4 overflow-y-auto scrollbar-hide">
      {/* first row */}
      {!searchClick && dataBaseUsers && dataBaseUsers.length!==0 && dataBaseUsers.map((element)=>{
       return  <div onClick={()=>{setCurrentChatUserId(element._id);getCureentChattingUser(element._id);getmessages(element._id);setActiveChat(true)}} className='flex shadow cursor-pointer rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5] p-0 lg:p-2'>
     <div className='pt-2'>
         <img className='w-12 h-10 rounded-full border-white border-2' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-black'>
      {capitalizeFirstLetter(element.name)}
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
      })}
         {searchClick && chattedUsersList && chattedUsersList.length!==0 && chattedUsersList.map((element)=>{
       return  <div onClick={()=>{setCurrentChatUserId(element._id);getCureentChattingUser(element._id);getmessages(element._id);setActiveChat(true)}} className='flex shadow cursor-pointer rounded-2xl mt-2 border-b-2 hover:bg-[#E6EBF5] p-0 pt-1  xs:p-2'>
     <div className='pt-2'>
         <img className='w-12 h-10 rounded-full border-white border-2' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />

     </div>
     <div className='flex flex-col w-full justify-between py-1'>
    <div className='flex  flex-1 justify-between items-center pl-2 '>
      <p className='font-small text-xs  xs:text-sm text-black'>
  {capitalizeFirstLetter(element.name)}
      </p>
      <p className=' pt-1 text-[10px] xs:text-xs text-gray-400'>
      02:50PM
      </p>
    </div>
    <div className='pl-2  text-[10px] xs:text-sm text-gray-400'>
This is theme ok
    </div>
     </div>
      </div>
      })}
      </div>
    </div>
  )
}
