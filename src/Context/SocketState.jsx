import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

export default function SocketState({ children }) {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { Me } = useContext(AuthContext);

  useEffect(() => {
    if (!Me?._id) return;

    const socket = io(import.meta.env.VITE_SOCKET, {
      transports: ["websocket"],
      query: { userId: Me._id },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.disconnect();
    };
  }, [Me?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}