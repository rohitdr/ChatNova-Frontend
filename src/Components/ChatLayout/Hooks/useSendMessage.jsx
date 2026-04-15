import { useCallback } from "react"


export default function useSendMessage({queryclient,uploadCloudinary,conversationId,sendingMessage,Me,replyMessage,uploadedImage,uploadedVideo,sendMessages,currentChatUserId}) {

   const addMessageToCache=useCallback((message)=>{
 queryclient.setQueryData(["messages",conversationId],(oldData)=>{
  if(!oldData) return oldData
  const newPages = [...oldData.pages]
  newPages[0] = {
  ...newPages[0],
  message: [message, ...newPages[0].message],
};
   return {...oldData,pages:newPages}
 })
   },[conversationId,queryclient])
 const createTempMessage =(type,url) => {
    const baseMessage = {
      _id: Date.now(),
      type,
      createdAt: Date.now(),
      senderId: {
        _id: Me._id,
        image: { url: Me.image?.url },
      },
    };

    switch (type) {
      case "text":
        return {
          ...baseMessage,
          text: sendingMessage,
          replyTo: replyMessage,
        };

      case "image":
        return {
          ...baseMessage,
          text: "New Photo",
          media: {
            url: url,
          },
        };

      case "video":
        return {
          ...baseMessage,
          text: "New Video",
          media: {
            url: url,
          },
        };

      default:
        return baseMessage;
    }
  }
  const createSendMessage = useCallback(() => {
    if (!sendingMessage?.trim()) return;
    const tempMessage = createTempMessage("text");

    const payload = {
      conversationId,
      receiverId: currentChatUserId,
      message: sendingMessage,
      tempId: tempMessage._id,
      replyTo: replyMessage,
    };

    sendMessages(payload);

    addMessageToCache(tempMessage);

    // setSendingMessage("");
    // setReplyMessage(null);
  },[sendingMessage,conversationId,currentChatUserId,replyMessage,addMessageToCache,])


  const createUploadImage = useCallback(async() => {
    if (!uploadedImage) return;
  const objectUrl=URL.createObjectURL(uploadedImage)
    const tempMessage = createTempMessage("image",objectUrl);
    addMessageToCache(tempMessage);
try{
await uploadCloudinary(conversationId, uploadedImage, tempMessage._id)
}finally{
 if (objectUrl) URL.revokeObjectURL(objectUrl);
}
  

    // setMediaSendModal(false);
    // setUploadedImage(null);
  },[conversationId,uploadedImage,addMessageToCache,uploadCloudinary])


  const createUploadVideo = useCallback(async() => {
    if (!uploadedVideo) return;
    const objectUrl=URL.createObjectURL(uploadedVideo)
    const tempMessage = createTempMessage("video",objectUrl);

    addMessageToCache(tempMessage);
    try{
 await uploadCloudinary(conversationId, uploadedVideo, tempMessage._id)
    }finally{
  if (objectUrl) URL.revokeObjectURL(objectUrl);
}
    


    // setMediaSendModal(false);
    // setUploadedVideo(null);
  },[conversationId,uploadedVideo,addMessageToCache,uploadCloudinary])
   return {
    createSendMessage,
    createUploadImage,
    createUploadVideo
   }
}
