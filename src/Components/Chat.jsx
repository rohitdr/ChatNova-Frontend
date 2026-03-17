import { useContext, useState } from "react";
import SideBar from "./SideBar";
import Users from "./Users";
import Profile from "./Profile";
import Chatting from "./Chatting";

import ChatNovaContext from "../Context/ChatNovaContext";
import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
export default function Chat() {
  const context = useContext(ChatNovaContext);
  const { activeChat } = context;
  const authcontext = useState(AuthContext);
  const { isServer } = authcontext;
  return isServer === 500 ? (
    <NoServer></NoServer>
  ) : (
    <div className="h-screen flex flex-col  lg:flex-row">
      <div
        className={` w-full ${activeChat ? "hidden" : "block"} lg:block order-3 lg:order-1 lg:w-[70px] `}
      >
        {" "}
        <SideBar></SideBar>
      </div>
      <div
        className={`w-full ${activeChat ? "hidden" : "block"} order-1 lg:block lg:order-2 lg:w-[320px]`}
      >
        <Users></Users>
      </div>
      <div
        className={` ${activeChat ? "block" : "hidden"} order-2 lg:block lg:flex-1`}
      >
        <Chatting></Chatting>
      </div>
    </div>
  );
}
