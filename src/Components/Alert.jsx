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
    const remvoe = setTimeout(() => {
      setAlert(null);
    }, 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(remvoe);
    };
  }, [alert]);
  if (!alert) return null;
  return (
    alert &&
    !leaving && (
      <div className="fixed inset-0 bg-black/10">
        <div
          className={` p-2 absolute top-10 right-10 shadow-2xl rounded-md bg-[#101627] ${type === "Warning" ? "border-yellow-200" : ""} ${type === "Error" ? "border-red-600" : ""} ${type === "Success" ? "border-green-500" : ""} border-2 h-20  w-96 
     ${leaving ? "animate-slide-out" : "animate-slide-in"}
     `}
        >
          <div className="flex justify-between">
            <div className="flex ">
              <div className="flex items-center text-white">
                {type === "Error" && (
                  <XCircleIcon
                    className={`w-6 h-6 text-red-600 `}
                  ></XCircleIcon>
                )}
                {type === "Success" && (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                )}
                {type === "Warning" && (
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400"></ExclamationTriangleIcon>
                )}
              </div>
              <div className="flex flex-col mx-4 py-1 text-white">
                <div className="">{type}</div>
                <div
                  className={`${type === "Warning" ? "text-yellow-200" : " text-white"}`}
                >
                  {message}
                </div>
              </div>
            </div>
            <div
              className="flex items-center text-white"
              onClick={() => {
                setLeaving(true);
              }}
            >
              <XMarkIcon className="w-6 h-6 text-white"></XMarkIcon>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
