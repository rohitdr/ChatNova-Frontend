import React from 'react'
import SideBar from './SideBar'
import Users from './Users'
import Chatting from './Chatting'
export default function Chat() {
  return (
    <div className='h-screen flex flex-col  lg:flex-row'>
      <div className=' w-full order-2 lg:order-1 lg:w-[70px]'> <SideBar></SideBar></div>
      <div className='w-full order-1 lg:order-2 lg:w-[320px]'><Users></Users></div>
      <div className=' hidden order-3 lg:block lg:flex-1'><Chatting></Chatting></div>
    </div>
  )
}
