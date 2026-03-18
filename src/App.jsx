import { useContext, useState } from "react";

import "./App.css";
import "./index.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import { Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import Alert from "./Components/Alert";
import AuthContext from "./Context/AuthContext";
import ForgetPassword from "./Components/ForgetPassword";
import AdditonalDeatils from "./Components/AdditonalDeatils";


function App() {
  const context = useContext(AuthContext);
  const { progress, setProgress } = context;
  const authcontext = useContext(AuthContext);
  const { alert } = authcontext;
  return (
    <>
      {alert && <Alert alert={alert}></Alert>}
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route exact path="/login" element={<Login></Login>}></Route>
        <Route exact path="/" element={<Chat></Chat>}></Route>
        <Route exact path="/additionaldetails" element={<AdditonalDeatils></AdditonalDeatils>}></Route>
        <Route exact path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
      
        <Route exact path="/SignUp" element={<SignUp></SignUp>}></Route>
      </Routes>
    </>
  );
}

export default App;
