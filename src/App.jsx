import { useContext} from "react";

import "./App.css";
import "./index.css";
import ChatPage from "./Components/ChatPage";
import { Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import Alert from "./Components/Alert";
import AuthContext from "./Context/AuthContext";

import { Suspense,lazy } from "react";
import AppLoader from "./Components/AppLoader";

import Login from "./pages/Login";

  const ForgetPassword = lazy(()=>import( "./pages/ForgetPassword"))
  
  const AdditionalDetails=lazy(()=> import("./Components/AdditionalDetails"))
import SignUp from './pages/SignUp';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';

import Settings from "./Components/Settings";
import Profile from "./features/users/components/Profile";
import Group from "./Components/Group";
import GroupInfo from "./Components/GroupInfo";
import ChatUsersList from './features/chat/components/ChatUsersList';
import ProfileSettings from "./pages/ProfileSetting";


function App() {



  const { progress, setProgress,alert } =  useContext(AuthContext);;

  return (
    <>

      {alert.length!==0 && <Alert alert={alert}></Alert>}
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <Routes>
        <Route  path="/login" element={<PublicRoute><Login/></PublicRoute> }></Route>
        <Route  path="/" element={<ProtectedRoute><ChatPage/></ProtectedRoute>}>
         <Route path="profile"  element={<Profile></Profile>}/>
         <Route index  element={<ChatUsersList></ChatUsersList>}/>
         <Route path="settings"  element={<ProfileSettings></ProfileSettings>}/>
         <Route path="group"  element={<Group></Group>}/>
          <Route path="group/:conversationId" element={<Group />} />
          <Route path="group/:conversationId/info" element={<GroupInfo></GroupInfo>} />
         <Route path="chat/:conversationId"  element={<ChatUsersList></ChatUsersList>}/>
         <Route path="chat/new/:userId"  element={<ChatUsersList></ChatUsersList>}/>
        </Route>





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
