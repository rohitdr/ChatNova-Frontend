import { useContext, useEffect, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";
export default function SocketState(props) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUser] = useState(null);
  const context = useContext(AuthContext);
  const {  Me } = context;
useEffect(() => {
  if (!Me?._id) return

  const newSocket = io(import.meta.env.VITE_SOCKET, {
    transports: ["websocket"],
    query: {
      userId: Me?._id,
    },
    withCredentials: true,
  })

  newSocket.on("getOnlineUsers", (users) => {
    setOnlineUser(users)
  })
  newSocket.on("connect_error", (err) => {
  console.log("Connect error:", err.message);
});

  setSocket(newSocket)

  return () => {
    newSocket.off("getOnlineUsers")   
    newSocket.disconnect()            
  }
}, [Me?._id])
  return (
    <SocketContext.Provider value={{ onlineUsers, socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}
