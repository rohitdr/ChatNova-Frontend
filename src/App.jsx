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
        <Route exact path="/login" element={<PublicRoute><Login></Login></PublicRoute> }></Route>
        <Route exact path="/" element={<ProtectedRoute><ChatPage/></ProtectedRoute>}></Route>
        <Route exact path="/additionaldetails"  element={
      <Suspense fallback={<AppLoader />}>
        <AdditionalDetails />
      </Suspense>
    }></Route>
        <Route exact path="/forgetpassword" element={
          <Suspense fallback={     <div><AppLoader></AppLoader></div>  }><ForgetPassword></ForgetPassword>  </Suspense>
          }></Route>
      
        <Route exact path="/SignUp" element={<SignUp></SignUp>}></Route>
      </Routes>
    
    </>
  );
}

export default App;
