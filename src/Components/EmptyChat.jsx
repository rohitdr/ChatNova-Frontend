export default function EmptyChat() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-5 rounded-full">
            💬
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Start a Conversation
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-sm mb-6">
          Select a user from the list to start chatting.
        </p>

        {/* Optional Button */}
       

      </div>
    </div>
  );
}