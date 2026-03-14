import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ChatNovaState from './Context/ChatNovaState.jsx'
import AuthState from './Context/AuthState.jsx'
import SocketState from './Context/SocketState.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

  <StrictMode>
        <AuthState>
         <SocketState>
      <ChatNovaState>
    <App />
     </ChatNovaState>
     </SocketState>
    </AuthState>
  </StrictMode>
 
  </BrowserRouter>,
)
