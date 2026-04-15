import { useContext} from "react";

import "./App.css";
import "./index.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import ChatPage from "./Components/ChatPage";
import { Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import Alert from "./Components/Alert";
import AuthContext from "./Context/AuthContext";

import { Suspense,lazy } from "react";
import AppLoader from "./Components/AppLoader";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

  const ForgetPassword = lazy(()=>import("./Components/ForgetPassword"))
  const AdditionalDetails=lazy(()=> import("./Components/AdditionalDetails"))

function App() {



  const { progress, setProgress,alert } =  useContext(AuthContext);;


  return (
    <>
      {alert && <Alert alert={alert}></Alert>}
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <Routes>
        <Route  path="/login" element={<PublicRoute><Login/></PublicRoute> }></Route>
        <Route  path="/" element={<ProtectedRoute><ChatPage/></ProtectedRoute>}></Route>
        <Route  path="/additionaldetails"  element={
      <Suspense fallback={<AppLoader />}>
       <ProtectedRoute> <AdditionalDetails /></ProtectedRoute>
      </Suspense>
    }></Route>
        <Route exact path="/forgetpassword" element={
          <Suspense fallback={     <div><AppLoader></AppLoader></div>  }>
            <PublicRoute>  <ForgetPassword/></PublicRoute>
          
             </Suspense>
          }></Route>
      
        <Route exact path="/SignUp" element={
          <PublicRoute>  <SignUp/></PublicRoute>
        
          }></Route>
      </Routes>
    
    </>
  );
}

export default App;
