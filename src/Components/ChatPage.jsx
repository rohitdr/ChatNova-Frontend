
import SideBar from "./SideBar";
import { Suspense,lazy } from "react";
import { Outlet, useParams } from "react-router-dom";

import EmptyChat from "./EmptyChat";
const ChatLayout = lazy(()=>import("./ChatLayout/ChatLayout"));
export default function Page() {
  const {conversationId,userId}=useParams()

  return  (
    <div className="h-screen flex flex-col  lg:flex-row">
      <div
        className={` w-full ${conversationId ? "hidden" : "block"} lg:block order-3 lg:order-1 lg:w-[70px] `}
      >
        <SideBar/>
      </div>
      <div
        className={`w-full ${conversationId ? "hidden" : "block"} order-1 lg:block lg:order-2 lg:w-[380px]`}
      >
        {/* <Users/> */}
        <Outlet></Outlet>
      </div>
      <div
        className={` ${conversationId ? "block" : "hidden"} order-2 lg:block lg:flex-1`}
      >
     { (conversationId ||userId) ? (
    <ChatLayout conversationId={conversationId} userId={userId} key={conversationId} />
  ) : (
    <EmptyChat mode="chat" />
  )}
      </div>
    </div>
  );
}
