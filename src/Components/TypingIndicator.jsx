import React, { useContext } from "react"

import AuthContext from "../Context/AuthContext"


function TypingIndicator({typingUser}) {
    const authcontext = useContext(AuthContext)
    const {Me} = authcontext
    const filterusers = typingUser.filter(t=>t.user!==Me._id)
    if(filterusers.length===0) return null
    const names = filterusers.map(t=>t.name).join(' , ')

  return  (
   <div
      className={` w-full flex   relative ml-2 `}
    >
      <div className=" flex flex-col justify-end  max-w-[15%] ">
       
       
      </div>
      <div className="flex max-w-[85%] flex-col mb-2 relative  ">
        <div
          className={` 2xs:text-sm  xs:text-lg md:text-xl lg:text-base ml-[26px] mt-[10px] px-4 py-2 lg:p-3 bg-[#F1F3F6] text-black rounded-xl lg:rounded-2xl  rounded-bl-none lg:rounded-bl-none`}
        >
        
         <div
          className={`flex text-xs pt-0.5 justify-start my-2`}
        > {names}
                 <span className='dot rounded-full bg-[#9ca3af] h-2 w-2 my-1  mx-1'></span>
            <span className='dot  rounded-full bg-[#9ca3af] h-2 w-2 my-1 mx-1' ></span>
            <span className='dot  rounded-full bg-[#9ca3af] h-2 w-2 my-1 mx-1'></span>
          <div>
           
          </div>
         <span>
        
         
         </span>
          
        </div>
      
        
     
        
    
   
        </div>
        </div>
        </div>
      
            
        
  )
}
TypingIndicator.displayName="TypingIndicator"
export default React.memo(TypingIndicator)

