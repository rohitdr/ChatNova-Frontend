export default function ChatHeaderSkeleton() {
  return (
    <div className="shrink-0 flex flex-row p-4 pt-3 lg:p-7 lg:py-3 border justify-between animate-pulse ">
      
    
      <div className="flex items-center gap-3">
        

        <div className="w-6 h-6 bg-gray-300 rounded lg:hidden"></div>

   
        <div className="lg:h-14 lg:w-14 h-10 w-10 rounded-full shimmer"></div>

     
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded shimmer"></div>
          <div className="h-3 w-16 rounded shimmer"></div>
        </div>
      </div>

  
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
      </div>
    </div>
  );
}