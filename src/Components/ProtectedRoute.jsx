import { useContext } from "react"
import AuthContext from "../Context/AuthContext"
import { Navigate } from "react-router-dom"
import AppLoader from "./AppLoader"


export default function ProtectedRoute({children}) {
const {Me,authReady,isMeLoading}=useContext(AuthContext)
if(!authReady || isMeLoading ) return <AppLoader></AppLoader>
if(!Me){
    return <Navigate to="/login" replace/>
}


  return children
}
