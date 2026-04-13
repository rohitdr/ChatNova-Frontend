import { useContext } from "react"
import AuthContext from "../Context/AuthContext"
import { Navigate } from "react-router-dom"
import AppLoader from "./AppLoader"


export default function PublicRoute({children}) {
const {Me,authReady}=useContext(AuthContext)
if(!authReady) return <AppLoader></AppLoader>
if(Me){
    return <Navigate to="/" replace/>
}


  return children
}
