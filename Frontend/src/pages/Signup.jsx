import { Button } from "flowbite-react";
import { useContext, useState } from "react";
import api from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Layout";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
      const res = await api.post("/api/auth/signup", formData);
      const data = res.data;

      const { token, user } = data;
      localStorage.setItem("token", token);
      login(token);

      setSuccess("Signup successful");

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (err) {
      setError("Signup failed: " + err.response?.data?.message || err.message);
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

        <h1 className="text-4xl font-bold">Signup</h1>
        <div>
          <div className="mb-2 block">
            <label htmlFor="name1" className="text-black">
              Your Name
            </label>
          </div>
          <input
            className="border w-full rounded-lg px-4 py-2"
            id="name1"
            type="text"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
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
