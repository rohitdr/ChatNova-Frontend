import  { useContext, useEffect, useState } from 'react'
import SocketContext from './SocketContext'
import { io } from 'socket.io-client'
import AuthContext from './AuthContext'
export default function SocketState(props) {
    const [socket,setSocket]=useState(null)
    const [onlineUsers,setOnlineUser]=useState(null)
    const context = useContext(AuthContext)
    const {refress_token,user}=context
useEffect(()=>{
    console.log(user)
if(user){
 console.log("Connecting socket for user:", user._id);
    const newSocket =io(import.meta.env.VITE_SOCKET,{
        query:{
            userId:user?._id
        }
    })
    newSocket.on("getOnlineUsers",(users)=>{
        setOnlineUser(users)
    })
    setSocket(newSocket)
    return ()=>newSocket.close();
}
else{
    if(socket){
        socket.close();
        console.log("socket is null")
        setSocket(null)
    }
}
},[user,refress_token])
  return (
  <SocketContext.Provider value={{onlineUsers,socket}}>
    {props.children}
  </SocketContext.Provider>
  )
}
