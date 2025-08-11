import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import api from "../../../../axiosInstance";

export default function AddEditStudentForm() {
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
    password : ""
  });
  const [studentsData, setStudentsData] = useOutletContext()
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const studentId = Number(id)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchStudentDetails() {
      try {
        const res = await api.get(`/api/admin/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentFormData({
          name: res.data.name,
          email: res.data.email,
          password : ""
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch course");
      }
    }
    if (id){
        fetchStudentDetails();
    } 
  }, [id]);

  function handleChange(e) {
    setStudentFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (id) {
        await api.put(`/api/admin/students/${id}`, studentFormData);
        setStudentsData(prev => prev.map(student => 
          student.id === studentId ? {...student, ...studentFormData} : student)
        )
        setSuccess("Student updated successfully");
        setStudentFormData({name:"", email: "", password: ""})
        setTimeout(() => navigate("/admin/students"), 1500);
      } else {
        const res = await api.post("/api/admin/students", studentFormData);
        const data = res.data.newStudent
        setStudentsData(prev => [...prev, data])
        setSuccess("Student added successfully");
        setStudentFormData({name:"", email: "", password: ""})
      }

    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 py-6">
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <Toast>
            <div className="text-sm font-normal text-red-600">{error}</div>
          </Toast>
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 z-50">
          <Toast>
            <div className="text-sm font-normal text-green-600">{success}</div>
          </Toast>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white shadow-lg p-6 w-[90%] lg:w-[40%] space-y-4"
      >
        <h1 className="text-4xl font-semibold">Student Form</h1>

        <div className="space-y-2">
          <label htmlFor="name1" className="text-lg font-semibold text-gray-800">
            Student Name
          </label>
          <input
            className="border w-full rounded-lg px-4 py-2"
            id="name1"
            type="text"
            name="name"
            placeholder="Student Name"
            required
            value={studentFormData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email1" className="text-lg font-semibold text-gray-800">
            Student Email
          </label>
          <input
            type="email"
            className="border w-full rounded-lg px-4 py-2"
            id="email1"
            name="email"
            placeholder="john@example.com"
            required
            value={studentFormData.email}
            onChange={handleChange}
          />
        </div>

          <div className="space-y-2">
          <label htmlFor="password1" className="text-lg font-semibold text-gray-800">
            Student Password
          </label>
          <input
            type="password"
            className="border w-full rounded-lg px-4 py-2"
            id="password1"
            name="password"
            required={id ? false : true}
            value={studentFormData.password}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          {id ? "Update Student" : "Create Student"}
        </Button>
      </form>
    </div>
  );
}
