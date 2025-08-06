import { Navigate, Outlet, useLocation } from "react-router-dom"
import {jwtDecode} from 'jwt-decode'
import { useContext, useEffect } from "react"
import { AuthContext } from "./Layout"

export default function AuthRequired() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: "You must login first" }}
      />
    );
  }

  return <Outlet />;
}