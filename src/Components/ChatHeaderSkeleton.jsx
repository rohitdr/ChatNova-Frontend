export default function ChatHeaderSkeleton() {
  return (
    <div className="shrink-0 flex flex-row p-4 pt-3 lg:p-7 lg:py-3 border justify-between animate-pulse ">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* Back button */}
        <div className="w-6 h-6 bg-gray-300 rounded lg:hidden"></div>

        {/* Avatar */}
        <div className="lg:h-14 lg:w-14 h-10 w-10 rounded-full shimmer"></div>

        {/* Name + status */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded shimmer"></div>
          <div className="h-3 w-16 rounded shimmer"></div>
        </div>
      </div>

      {/* RIGHT SIDE ICONS */}
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
        <div className="w-5 h-5 rounded shimmer"></div>
      </div>
    </div>
  );
}