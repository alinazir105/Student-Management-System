import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useContext} from "react"
import { AuthContext } from "./Layout"

export default function AuthRequired() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if(user===undefined){
    return <div>Loading...</div>
  }
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