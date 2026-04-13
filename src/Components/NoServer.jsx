
import {
ArrowPathIcon,
WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon } from "@heroicons/react/24/solid";

export default function NoServer({
code = "503",
title = "Server is Taking a Break",
message = "Our servers are currently overloaded. Please try again in a moment.",
}) {
const handleRetry = () => {
window.location.reload();
};

return ( <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4">


  <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center transition-all duration-300 hover:scale-[1.01]">
    
  
    <div className="flex justify-center mb-4">
      <div className="p-3 rounded-full bg-indigo-100/60 shadow-inner">
        <WrenchScrewdriverIcon className="w-8 h-8 text-indigo-600" />
      </div>
    </div>

  
    <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight mb-2">
      {code}
    </h1>

    <div className="flex justify-center mb-3 opacity-40">
      <MinusIcon className="w-6 h-6" />
    </div>

  
    <h2 className="text-xl font-semibold text-gray-700 mb-2">
      {title}
    </h2>

  
    <p className="text-gray-500 text-sm leading-relaxed mb-6">
      {message}
    </p>

  
    <button
      onClick={handleRetry}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200"
    >
      <ArrowPathIcon className="w-5 h-5" />
      Try Again
    </button>

  </div>
</div>

);
}
