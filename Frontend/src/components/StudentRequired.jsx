import { useContext } from "react"
import { AuthContext } from "./Layout"
import { Outlet } from "react-router-dom"
export default function StudentRequired(){
    const {user} = useContext(AuthContext)
    console.log(user)
    return(
        user.role === 'student' ? 
        <Outlet /> 
        : 
        <h1 className="text-4xl font-bold">Login as a Student to access this page</h1>
    )
}