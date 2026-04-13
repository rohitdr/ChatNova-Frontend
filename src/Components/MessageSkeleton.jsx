import React from "react";

export default function MessageSkeleton({ send }) {
  return (
    <div className={`w-full flex ${send ? "flex-row-reverse" : ""}`}>
      
   
      <div className="flex flex-col justify-end max-w-[15%]">
        <div className="w-[40px] h-[38px] rounded-full shimmer border-white border-4"></div>
      </div>

      <div className="flex max-w-[85%] flex-col mb-2">
        
  
        {!send && (
          <div className="h-2 w-16 mx-2 mb-1 rounded shimmer"></div>
        )}

        <div
          className={`px-4 py-2 rounded-xl ${
            send
              ? "bg-[#6C63FF]/20 rounded-br-none"
              : "bg-gray-200 rounded-bl-none"
          }`}
        >
       
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 rounded shimmer"></div>
            <div className="h-3 w-24 rounded shimmer"></div>
          </div>

     
          <div className="flex justify-end mt-2">
            <div className="h-2 w-10 rounded shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}