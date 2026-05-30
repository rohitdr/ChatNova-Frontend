import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function EmptyChat({mode}) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-5 rounded-full hover:scale-110">
            {mode==="chat" && "💬" } 
        { mode==="users" && <MagnifyingGlassIcon className="w-10 h-10" />}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
       
                {mode==="chat" && "   Start a Conversation" } 
        { mode==="users" && "Find Someone to Chat"}
        </h2>

       
        <p className="text-gray-500 text-sm mb-6">
      
                {mode==="chat" && " Select a user from the list to start chatting." } 
        { mode==="users" && " Search for a user from the searchbar and start a conversation. Your messages will appear here once you select a chat."}
        </p>

    
       

      </div>
    </div>
  );
}