import { useNavigate, Outlet } from "react-router-dom"
import NavbarComponent from "./Navbar"
import FooterComponent from "./Footer"
import { useState, useEffect, createContext } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()
export default function Layout() {
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            return
        }

        try{
            const decoded = jwtDecode(token)
            if(Date.now() > decoded.exp * 1000){
                localStorage.removeItem("token")
                setUser(null)
            }
            else{
                setUser({
                    id : decoded.id,
                    name : decoded.name,
                    email : decoded.email,
                    role : decoded.role
                })
            }
        }
        catch(error){
            localStorage.removeItem("token")
            setUser(null)
        }
    }, [])

    function login(token){
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });
    } catch {
      setUser(null);
    }
  };
  
    function logout() {
        localStorage.removeItem("token")
        setUser(null)
        navigate('login', {replace: true})
    }
    return (
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            <div>
                <NavbarComponent />
                <main>
                    <Outlet />
                </main>
                <FooterComponent />
            </div>
        </AuthContext.Provider>
    )
}
export {AuthContext}