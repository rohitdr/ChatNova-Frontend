import { useContext } from "react"
import AuthContext from "../Context/AuthContext"
import { Navigate } from "react-router-dom"


export default function ProtectedRoute({children}) {
const {Me}=useContext(AuthContext)
if(!Me){
    return <Navigate to="/login" replace/>
}


  return children
}
