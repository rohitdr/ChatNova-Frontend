import { useCallback, useEffect, useRef, useState } from "react";

export default function useTyping({ socket, Me, conversationId }) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);

  const handleTyping = useCallback(() => {
    if (!socket || !conversationId || !Me) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId,
        userId: Me._id,
        name: Me.name,
      });
    }
  }, [socket, isTyping, conversationId, Me]);

  const handleStopTyping = useCallback(() => {
    if (!socket || !conversationId || !Me) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false); 
      socket.emit("stop_typing", {
        conversationId,
        userId: Me._id,
        name: Me.name,
      });
    }, 1500);
  }, [socket, conversationId, Me]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    handleTyping,
    handleStopTyping

  };
}