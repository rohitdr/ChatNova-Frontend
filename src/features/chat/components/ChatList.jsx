
import { Virtuoso } from 'react-virtuoso'
import { useMe } from '../../users/hooks/UseMe'
import { Link } from 'react-router-dom'
import UserItem from '../../users/components/UserItem'

export default function ChatList({isloading,handleEndReach,users,handleClick}) {
    const {data:Me}=useMe()
  return (
  <>
      {!isloading && (
            <div className="h-full">
              <Virtuoso
                className="scrollbar-hide"
                endReached={handleEndReach}
                computeItemKey={(_index, element) => element._id}
                overscan={200}
                defaultItemHeight={65}
                style={{ height: "100%" }}
                increaseViewportBy={{ top: 0, bottom: 400 }}
                data={users}
                followOutput={false}
                components={{
                  Footer: () => <div style={{ height: "70px" }} />
                }}
                itemContent={(index, element) => (
                 <Link to={`/chat/${element.ConversationId}`} style={{height:65}}>

                    <UserItem
                      user={element}
                      handleUserClick={handleClick}
                       currentUser={Me}
                    />
                  </Link>
                )}
              />
            </div>
          )}
  
  </>
  )
}
