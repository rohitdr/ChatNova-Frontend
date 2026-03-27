export default function UserSkeleton() {
  return (
    <div className="flex shadow border-2 rounded-2xl mt-2 bg-white p-2 ">
      
    
      <div className="w-12 h-10 mt-1 rounded-full bg-gray-300 shimmer"></div>

     
      <div className="flex flex-col w-full justify-between py-1 ml-2">
        
       
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-gray-300 rounded shimmer"></div>
          <div className="h-3 w-10 bg-gray-300 rounded"></div>
        </div>
     <div className="mt-2 flex justify-between">
          <div className="h-3 w-40 bg-gray-300 rounded"></div>
        </div>

      </div>
    </div>
  )
}
