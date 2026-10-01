import React from 'react'

export default function GroupRemoveItem({isAdmin,handleRemove}) {
  return (
     <div className=" flex flex-col justify-center">

       <UserMinusIcon className={`w-5 font-medium   h-5 text-red-500 cursor-pointer ${!isAdmin&& "hidden"}`}
         onClick={handleRemove}
         />
        </div>
      
  )
}
