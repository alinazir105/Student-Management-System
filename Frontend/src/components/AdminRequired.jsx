import { useContext } from "react"
import { AuthContext } from "./Layout"
import { Outlet } from "react-router-dom"
export default function AdminRequired(){
    const {user} = useContext(AuthContext)
    console.log(user)
    return(
        user.role === 'admin' ? 
        <Outlet /> 
        : 
        <h1 className="text-4xl font-bold">Login as an Admin to access this page</h1>
    )
}