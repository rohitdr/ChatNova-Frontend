
import React, { useContext, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import AuthContext from "../Context/AuthContext";
import { AnimatePresence,motion } from "framer-motion";

export default function Alert() {
  const { alert, setAlert } = useContext(AuthContext);

  // Auto dismiss alerts after 3 seconds
  useEffect(() => {
    const timers = alert.map((item) =>
      setTimeout(() => {
        setAlert((prev) => prev.filter((a) => a.id !== item.id));
      }, 3000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [alert, setAlert]);

  const removeAlert = (id) => {
    setAlert((prev) => prev.filter((item) => item.id !== id));
  };

  if (alert.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alert.map(({ id, type, message }) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="pointer-events-auto"
          >
            <div
              className={`
                flex items-start gap-3
                w-[320px] max-w-[calc(100vw-2rem)]
                p-4
                rounded-2xl
                shadow-2xl
                border
                backdrop-blur-lg
                bg-white/95

                ${
                  type === "Success"
                    ? "border-green-200"
                    : type === "Error"
                    ? "border-red-200"
                    : "border-yellow-200"
                }
              `}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
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
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">
                  {type}
                </p>

                <p className="mt-1 text-2xs sm:text-md text-gray-600 break-words truncate">
                  {message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeAlert(id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

