import  { useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import MessageSkeleton from '../MessageSkeleton'
import TypingIndicator from '../TypingIndicator'
import Message from '../Message'
export default function MessageList({messages,isLoading,virtuosoRef,totalCount,handleRangeChange,firstItemIndexRef,Me,typingUser,}) {
    const renderContent =useCallback((index, message) => (
                   <div className={index === firstItemIndexRef.current - 21 ? "mb-3" : ""}>
                    <Message
                      send={Me?._id === message.senderId?._id}
                      message={message}
                    ></Message></div>
                  ),[Me])
                  const hasMessages = messages.length > 0;
                  const Footer =useCallback(() => (
    <div style={{ minHeight: "24px" }}>
      {typingUser.length > 0 && (
        <TypingIndicator typingUser={typingUser} />
      )}
    </div>
  ),[typingUser])
  return (
   <div
              className={` px-3 sm:px-6  scrollbar-hide flex-1 min-h-0  overflow-hidden`}
            >  
              { !isLoading || hasMessages? (
                <Virtuoso
                  className="scrollbar-hide"
                 ref={virtuosoRef}
                  computeItemKey={(index, message) => message._id}
                  firstItemIndex={100000-totalCount}
                  initialTopMostItemIndex={100000}
                  style={{ height: "100%" }}
                  increaseViewportBy={{ top: 500, bottom: 300 }}
                  data={messages}
                 followOutput={false}
               
                  rangeChanged={handleRangeChange}
               
                  itemContent={renderContent}
                 components={{
  Footer
}}
                />
              ) : (
                [...Array(10)].map((_, i) => (
                  <MessageSkeleton key={i} send={i % 2 === 0}></MessageSkeleton>
                ))
              )}
            </div>
  )
}
