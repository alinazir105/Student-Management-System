
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./Layout";
import { useContext } from "react";
export default function NavbarComponent() {
  const {user, logout} = useContext(AuthContext) 
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="https://flowbite-react.com">
        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavLink to="/" className={({isActive}) => `text-white ${isActive ? "font-bold underline" : ""}`}>
          Home
        </NavLink>
        <NavLink to="about" className={({isActive}) => `text-white ${isActive ? "font-bold underline" : ""}`}>
          About
        </NavLink>
        <NavLink to="contact" className={({isActive}) => `text-white ${isActive ? "font-bold underline" : ""}`}>Contact</NavLink>

        {user ? 
        <NavLink className="text-white" onClick={logout}>Logout</NavLink> 
        :
        <NavLink to="login" className={({isActive}) => `text-white ${isActive ? "font-bold underline" : ""}`}>Login</NavLink>
        }

      </NavbarCollapse>
    </Navbar>
  );
}
