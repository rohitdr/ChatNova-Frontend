import { useContext } from "react"
import AuthContext from "../../../Context/AuthContext"
import { Navigate } from "react-router-dom"
import AppLoader from "../../../Components/AppLoader"
import { useMe } from './../../users/hooks/UseMe';


export default function ProtectedRoute({children}) {
const { authReady }=useContext(AuthContext)
const {data,isLoading}=useMe()
if(!authReady || isLoading ) return <AppLoader></AppLoader>
if(!data){
    return <Navigate to="/login" replace/>
}


  return children
}
