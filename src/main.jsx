import { StrictMode, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ChatNovaState from "./Context/ChatNovaState.jsx";
import AuthState from "./Context/AuthState.jsx";
import SocketState from "./Context/SocketState.jsx";
import AuthContext from "./Context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
 <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <StrictMode>
      <AuthState>
        <SocketState>
          <ChatNovaState>
          <Root/>
          </ChatNovaState>
        </SocketState>
      </AuthState>
    </StrictMode>
  </BrowserRouter>
  </QueryClientProvider>,
);
function Root (){
  const {user}=useContext(AuthContext)
  

  return <App key={user?._id || "guest"}></App>
}

