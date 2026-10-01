import React from 'react'

export default function GroupAddItem({handleAdd}) {
  return (
   
   <div className=" flex flex-col justify-center">

       <UserPlusIcon className={`w-5 font-medium   h-5 text-blue-500 cursor-pointer`}
         onClick={handleAdd}
         />
        </div>
 
  )
}
