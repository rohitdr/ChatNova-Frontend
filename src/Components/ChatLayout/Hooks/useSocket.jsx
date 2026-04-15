import { useCallback,useEffect } from "react";

export default function useSocket({
    socket,
  conversationId,
  queryclient,
  Me,
  setTypingUser,

 
}) {
     const updateGroupList =useCallback((newMessage)=>{
    if (newMessage.conversationToSend?.type !== "group") return;
     
          queryclient.setQueryData(["groups"],(oldData)=>{
           if(!oldData) return oldData
          
            const filterd =oldData.filter((group)=>group._id !== newMessage.conversationToSend._id)
              return [newMessage.conversationToSend,...filterd]
          })
    
         
        },[queryclient])
        const updateUsersList = useCallback((newMessage, currentUserId, activeConversationId) => {
       
        if (newMessage.conversationToSend?.type !== "private") return;
          queryclient.setQueryData(["users"], (oldData) => {
            if (!oldData) return oldData;
        
            const lastMessage = {
              text: newMessage.text,
              createdAt: newMessage.createdAt,
            };
        
            const newPages = oldData.pages.map((page, pageIndex) => {
              let users = [...page.users];
        
              const index = users.findIndex(
                (c) => c.ConversationId === newMessage.conversationId
              );
        
              const isCurrentChatOpen =
                newMessage.conversationId === activeConversationId;
        
              if (index !== -1) {
                const oldUser = users[index];
        
                const updatedUser = {
                  ...oldUser,
                  lastMessage,
                  participents: newMessage.conversationToSend?.participents,
                  unreadCount:
                    Me?._id !== newMessage.senderId._id
                      ? isCurrentChatOpen
                        ? 0
                        : (oldUser.unreadCount || 0) + 1
                      : 0,
                };
        
                users = users.filter(
                  (c) => c.ConversationId !== newMessage.conversationId
                );
        
                return {
                  ...page,
                  users: [updatedUser, ...users],
                };
              }
        
              if (pageIndex === 0) {
                const newuser = newMessage.conversationToSend?.participents?.find(
                  (p) => p.user._id !== currentUserId
                );
        
                if (!newuser) return page;
        
                return {
                  ...page,
                  users: [
                    {
                      ConversationId: newMessage.conversationToSend.ConversationId,
                      lastMessage,
                      user: newuser.user,
                      unreadCount:
                        Me?._id !== newMessage.senderId._id
                          ? isCurrentChatOpen
                            ? 0
                            : 1
                          : 0,
                    },
                    ...users,
                  ],
                };
              }
        
              return page;
            });
        
            return { ...oldData, pages: newPages };
          });
            // virtuosoRef.current?.scrollToIndex({
            //   index: 100000,
            //   behavior: "auto",
            // });
        },[Me,queryclient])
         const updateMessageToQuerySocket = useCallback((newMessage) => {
          queryclient.setQueryData(["messages", conversationId], (oldData) => {
            if (!oldData) return oldData;
        
            let replaced = false;
        let alreadyExists=false
            const newPages = oldData.pages.map((page) => {
              const updatedMessages = page.message.map((msg) => {
                if (msg._id === newMessage.tempId) {
                  replaced = true;
                  return newMessage; 
                }
                if (msg._id === newMessage._id) {
                  alreadyExists = true;
                }
                return msg;
              });
        
              return {
                ...page,
                message: updatedMessages,
              };
            });
        
           
            if (!replaced && !alreadyExists) {
              newPages[0] = {
                ...newPages[0],
                message: [
                  ...newPages[0].message,
                  newMessage,
                ],
              };
            }
        
            return {
              ...oldData,
              pages: newPages,
            };
          });
        },[conversationId,queryclient])
           const userTypingHandler=useCallback(({ userId, name })=>{
   setTypingUser((prev) => {
        if (prev.find((p) => p.user === userId)) {
          return prev;
        }
        return [...prev, { user: userId, name }];
      });
      },[setTypingUser])
    const userStopTypingHandler=useCallback(({ userId })=>{
setTypingUser((prev) => prev.filter((p) => p.user !== userId));
    },[setTypingUser])
   useEffect(() => {
    if (!socket) return;
    const handleReaction = ({ messageId, reaction }) => {
        queryclient.setQueryData(["messages",conversationId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>
          msg._id === messageId ? { ...msg, reaction: reaction } : msg,
          )
          return {
        ...page,
        message: updatedMessage,
      };
      })
        return {
      ...oldData,
      pages: newPages,
    };
     })
    };
      const deliverHandler = ({ messageId, deliveredTo }) => {
     queryclient.setQueryData(["messages",conversationId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>
          msg._id === messageId ? { ...msg, deliveredTo: [...new Set([...msg.deliveredTo, ...deliveredTo])] } : msg,
          )
          return {
        ...page,
        message: updatedMessage,
      };
      })
        return {
      ...oldData,
      pages: newPages,
    };
     })
      


    };
      const seenHandler = ({conversationId:convId,userId, seenAt }) => {
  
         queryclient.setQueryData(["messages",convId],(oldData)=>{
      if(!oldData) return oldData
      const newPages = oldData.pages.map((page)=>{
          const updatedMessage = page.message.map((msg)=>{
         const alreadySeen = msg.seenBy.some((s)=>s.user.toString() === userId)
       if(msg.senderId.toString() !==userId && !alreadySeen){
        return{
          ...msg,
          seenBy:[...msg.seenBy,{user:userId,seenAt}]
        }
       }
        return msg})
          return {
        ...page,
        message: updatedMessage,
      };
      })
        return {
      ...oldData,
      pages: newPages,
    };
     })
   queryclient.setQueryData(["groups"], (oldData) => {
  if (!oldData) return oldData;

  const groups = oldData.map((group) => {
    const participents = group.participents?.map((p) => {
      if (p.user.toString() === userId) {
        return { ...p, unreadCount: 0 };
      }
      return p;
    });

    return { ...group, participents };
  });

  return [...groups];
});
   

    };
      const handleNewMessage = (newMessage) => {
    
      if (
        (newMessage.conversationId === conversationId) 
      ) {
       if(newMessage.senderId._id !== Me?._id){

         socket.emit("mark_seen", {
           conversationId: conversationId,
           userId: Me._id,
         });
       }
        /// setting current user chat
       updateMessageToQuerySocket(newMessage)
      }
  
      updateGroupList(newMessage)
      updateUsersList(newMessage,Me._id,conversationId)

    
    };
   
     socket.on("user_stop_typing",userStopTypingHandler);

    socket.on("user_typing", userTypingHandler);
    socket.on("reaction_updated", handleReaction);
        socket.on("message_seen", seenHandler);
           socket.on("newMessage", handleNewMessage);
      socket.on("message_delivered", deliverHandler);
    return () => {
      socket.off("reaction_updated", handleReaction);
        socket.off("message_delivered", deliverHandler);
            socket.off("message_seen", seenHandler);
                socket.off("newMessage", handleNewMessage);
                  socket.off("user_typing",userTypingHandler);
      socket.off("user_stop_typing",userStopTypingHandler);
    };
  }, [ socket,
  conversationId,
  Me,
  updateMessageToQuerySocket,
  updateGroupList,
  updateUsersList,]);
}
