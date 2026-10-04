import React from 'react'
import { useMe } from '../../users/hooks/UseMe'
import { NavLink } from 'react-router-dom'
import UserItem from '../../users/components/UserItem'

export default function ChatSearchResults({users,hanldeclick,isSearchLoading}) {
    const {data:Me}=useMe()
  return (
    <>
               {!isSearchLoading  && users?.length > 0 ? (
                  users.map((element) => (
                         <NavLink to={`/chat/new/${element._id}`} key={element._id}  style={{height:"74px"}}>
                      <UserItem
                        user={element}
                        handleUserClick={hanldeclick}
                         currentUser={Me}
                      />
                   </NavLink>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No users found
                  </div>
                )}
     </>         
          
  )
}
