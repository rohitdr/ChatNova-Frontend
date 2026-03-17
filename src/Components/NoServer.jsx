import React from "react";
import {
  ArrowPathIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon } from "@heroicons/react/24/solid";
export default function NoServer() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <WrenchScrewdriverIcon className="w-10 mb-4 opacity-40 h-10 text-[#4B5563]"></WrenchScrewdriverIcon>
        </div>

        <h1 className="text-7xl text-[#4B5563] font-extrabold text-center mb-14 ">
          503
        </h1>
        <div className="flex justify-center opacity-50">
          <MinusIcon className="w-10 h-10"></MinusIcon>
        </div>
        <div className="text-2xl text-center font-bold mb-4">
          Hang Tight,We'll Be Back Soon
        </div>

        <div className="text-center ">
          Our servers are currently overloaded,and we need a little time to
          catch up.
          <div className="mb-20">
            We apologize for the inconveinience and appreciate your patience
          </div>
        </div>
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => {
            location.reload();
          }}
        >
          {" "}
          <div className=" flex p-3 border-2 rounded-lg">
            {" "}
            <ArrowPathIcon className="w-6 h-6 text-blue-500 mx-2" />
            <div> Try Refreshing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
