import { useContext, useState } from "react";

import "./App.css";
import "./index.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import Chatting from "./Components/Chatting";
import { Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import ChatNovaContext from "./Context/ChatNovaContext";

import AuthContext from "./Context/AuthContext";
function App() {
  const context = useContext(AuthContext);
  const { progress, setProgress } = context;

  return (
    <>
   
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route exact path="/login" element={<Login></Login>}></Route>
        <Route exact path="/" element={<Chat></Chat>}></Route>
        <Route exact path="/SignUp" element={<SignUp></SignUp>}></Route>
      </Routes>
    </>
  );
}

export default App;
