import { Button } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Layout";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const redirectPath = location?.state?.from?.pathname;
  const loginMessage = location?.state?.message


  useEffect(()=>{
    if(loginMessage){
      const timer = setTimeout(()=>{
        navigate("/login", {replace: true, state: {}})
      }, 100)

      return ()=>clearTimeout(timer)
    }
  }, [loginMessage, navigate])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);

      const user = jwtDecode(token);

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    }
  }, []);

  function handleChange(e) {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/auth/login", formData);
      const data = res.data;

      const { token, user } = data;
      localStorage.setItem("token", token);

      login(token);

      setSuccess("Login successful");

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (err) {
      setError("Login failed: " + err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl shadow-2xl px-4 py-12 mx-auto justify-center flex w-[90%] lg:w-[40%] flex-col gap-4 border"
      >
        {error && <h3 className="text-red-600 text-center">{error}</h3>}
        {success && <h3 className="text-green-600 text-center">{success}</h3>}

        {location?.state?.message && (
          <h3 className="text-red-600 text-center">{location.state.message}</h3>
        )}

        <h1 className="text-4xl font-bold">Login</h1>
        <div>
          <div className="mb-2 block">
            <label htmlFor="email1" className="text-black">
              Your email
            </label>
          </div>
          <input
            className="border w-full rounded-lg px-4 py-2"
            id="email1"
            type="email"
            name="email"
            placeholder="name@flowbite.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block text-black">
            <label htmlFor="password1" className="text-black">
              Your password
            </label>
          </div>
          <input
            className="border w-full rounded-lg px-4 py-2"
            id="password1"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
