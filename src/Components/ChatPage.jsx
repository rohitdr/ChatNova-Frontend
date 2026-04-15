import { useContext } from "react";
import SideBar from "./SideBar";
import Users from "./Users";
import { Suspense,lazy } from "react";
import ChatNovaContext from "../Context/ChatNovaContext";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";

const ChatLayout = lazy(()=>import("./ChatLayout/ChatLayout"));
export default function ChatPage() {

  const { activeChat,conversationId } = useContext(ChatNovaContext);
 
  const { isServerDown } =  useContext(AuthContext);
  if(isServerDown) return (<NoServer></NoServer>)
  return  (
    <div className="h-screen flex flex-col  lg:flex-row">
      <div
        className={` w-full ${activeChat ? "hidden" : "block"} lg:block order-3 lg:order-1 lg:w-[70px] `}
      >
    
        <SideBar/>
      </div>
      <div
        className={`w-full ${activeChat ? "hidden" : "block"} order-1 lg:block lg:order-2 lg:w-[380px]`}
      >
        <Users/>
      </div>
      <div
        className={` ${activeChat ? "block" : "hidden"} order-2 lg:block lg:flex-1`}
      >
        <Suspense fallback={null}>
        <ChatLayout key={conversationId}/></Suspense>
      </div>
    </div>
  );
}
