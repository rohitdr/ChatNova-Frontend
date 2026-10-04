
export  const normalizeItem = (element, type) => {
    if (type === "chat") {
      return {
        element,
        name: element.user?.name,
        image: element.user?.image?.url,
        lastMessage: element.lastMessage,
        _id: element.user._id,
        unreadCount: element.unreadCount,
        ConversationId:element.ConversationId
      };
    }

    if (type === "search") {
      return {
        element,
        name: element.name,
        image: element.image?.url,
        lastMessage: null,
        _id: element._id,
        unreadCount: null
      };
    }
  }