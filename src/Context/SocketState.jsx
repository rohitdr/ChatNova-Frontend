import { useContext, useEffect, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";
export default function SocketState(props) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUser] = useState(null);
  const context = useContext(AuthContext);
  const {  user } = context;
useEffect(() => {
  if (!user) return

  const newSocket = io(import.meta.env.VITE_SOCKET, {
    transports: ["websocket"],
    query: {
      userId: user?._id,
    },
    withCredentials: true,
  })

  newSocket.on("getOnlineUsers", (users) => {
    setOnlineUser(users)
  })

  setSocket(newSocket)

  return () => {
    newSocket.off("getOnlineUsers")   
    newSocket.disconnect()            
  }
}, [user])
  return (
    <SocketContext.Provider value={{ onlineUsers, socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}
