import { useContext } from "react"
import AuthContext from "../../../Context/AuthContext"
import { Navigate } from "react-router-dom"
import AppLoader from "../../../Components/AppLoader"
import { useMe } from './../../users/hooks/UseMe';


export default function PublicRoute({children}) {
const {authReady}=useContext(AuthContext)
const {data}=useMe()
if(!authReady) return <AppLoader></AppLoader>
if(data){
    return <Navigate to="/" replace/>
}


  return children
}
