import {  XMarkIcon } from '@heroicons/react/24/outline';
import { PhotoIcon, VideoCameraIcon,PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

export default function ChatInput(props) {
    const {
  messageState: { sendingMessage, setSendingMessage, replyMessage, setReplyMessage,handleSendMessage },
  typingHandlers: { handleTyping, handleStopTyping },
  mediaHandlers: { videochangehandler, imagechangehandler },
  
} = props;
    const handleChange=(e)=>{
      
      handleTyping();
 
        handleStopTyping();
  
      
      setSendingMessage(e.target.value);
    }
    const handleKeyDown=(e)=>{
    
        if(e.key === "Enter" && !e.shiftKey && sendingMessage.trim()){
            handleSendMessage()
        }

    }
    const videoInputRef =useRef(null)
    const imageInputRef =useRef(null)
    
  return (
         <div className="bottom-0 flex justify-between shrink-0">
          <div className="w-full relative flex flex-col justify-center">


  {replyMessage && (
    <div className="absolute bottom-full left-0 w-full mb-1 bg-[#f1f3f7] border-l-4 shadow-md flex justify-between items-center px-2 py-1 rounded-sm">
      
      <div className="truncate text-gray-600 text-sm">
        {replyMessage.text}
      </div>

      <XMarkIcon
        onClick={() => setReplyMessage(null)}
        className="w-4 h-4 cursor-pointer text-gray-400 hover:text-black"
      />
    </div>
  )}


  <input
    type="text"
    onChange={handleChange} 
    onKeyDown={handleKeyDown}
    className="h-10 md:h-12 w-full bg-[#E6EBF5] rounded-lg shadow-sm outline-none px-3"
    placeholder="Enter message here..."
    value={sendingMessage || ""}
  />

</div>
              <div className=" flex justify-between items-center">
               
                <button
                type='button'
                  className="p-2.5 px-1 sm:px-2.5"
                  onClick={() => {
                    videoInputRef.current.click();
                  }}
                >
                  <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6159CB]  cursor-pointer" />
                  <input
                    type="file"
                    ref={videoInputRef}
                    id="videoMessageInput"
                    accept="video/*"
                    className="hidden"
                    onChange={videochangehandler}
                  />
                </button>
                
              <button
              type='button'
              className="p-2.5 px-1 sm:px-2.5"   onClick={() => {
                      imageInputRef.current.click();
                    }}>
                  <PhotoIcon 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 cursor-pointer"
                  
                  /></button>
                  <input
                    type="file"
                    ref={imageInputRef}
                    id="imageMessageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={imagechangehandler}
                  />
         
                <button
                type='button'
                  className="p-2.5  bg-[#6159CB] rounded-full disabled:opacity-50 "
                  onClick={handleSendMessage}
                  disabled={!sendingMessage?.trim()}
                >
                  <PaperAirplaneIcon className=" w-5 h-5 sm:w-6 -rotate-90 sm:h-6 text-white cursor-pointer  " />
                </button>
              </div>
</div>
  )
}
