import React, { useContext, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import AuthContext from "../Context/AuthContext";

export default function Alert(props) {
  const type = props?.alert?.type;
  const message = props?.alert?.message;

  const authcontext = useContext(AuthContext);
  const { alert, setAlert } = authcontext;
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!alert) return;
    setLeaving(false);
    const timer = setTimeout(() => {
      setLeaving(true);
    }, 3000);
    const remove = setTimeout(() => {
      setAlert(null);
    }, 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [alert]);
 if (!alert) return null;

return (
  <div className="fixed top-5 right-5 z-50">
    <div
      className={`flex items-start gap-3 w-80 md:w-96 p-4 rounded-xl shadow-xl 
      backdrop-blur-lg border transition-all duration-300
      ${leaving ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}
      
      ${type === "Success" && "bg-green-50/80 border-green-300"}
      ${type === "Error" && "bg-red-50/80 border-red-300"}
      ${type === "Warning" && "bg-yellow-50/80 border-yellow-300"}
      `}
    >
      {/* Icon */}
      <div className="mt-1">
        {type === "Error" && (
          <XCircleIcon className="w-6 h-6 text-red-500" />
        )}
        {type === "Success" && (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        )}
        {type === "Warning" && (
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-normal sm:font-medium text-gray-800">{type}</p>
        <p className="text-xs sm:text-sm text-gray-600">{message}</p>
      </div>

      {/* Close */}
      <button
        onClick={() => setLeaving(true)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);
}
