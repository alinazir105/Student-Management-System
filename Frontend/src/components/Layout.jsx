import { useNavigate, Outlet } from "react-router-dom";
import NavbarComponent from "./Navbar";
import FooterComponent from "./Footer";
import { useState, createContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default function Layout() {
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      if (Date.now() > decoded.exp * 1000) {
        localStorage.removeItem("token");
        return null;
      }
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromToken);
  const navigate = useNavigate();

  function login(token) {
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
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      <div className="h-screen">
        <NavbarComponent />
        <main>
          <Outlet />
        </main>
        <FooterComponent />
      </div>
    </AuthContext.Provider>
  );
}

export { AuthContext };
