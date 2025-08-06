import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../axiosInstance";

export default function AddEditStudentForm() {
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchStudentDetails() {
      try {
        const res = await api.get(`/api/admin/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentFormData({
          name: res.data.title,
          email: res.data.description,
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
        await api.put(`/api/admin/students/${id}`, studentFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Student updated successfully");
      } else {
        await api.post("/api/admin/students", studentFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Student added successfully");
      }

      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6">
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
          <label htmlFor="title1" className="text-lg font-semibold text-gray-800">
            Course Title
          </label>
          <input
            className="border w-full rounded-lg px-4 py-2"
            id="title1"
            type="text"
            name="title"
            placeholder="Course title"
            required
            value={studentFormData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description1" className="text-lg font-semibold text-gray-800">
            Course Description
          </label>
          <textarea
            className="border w-full rounded-lg px-4 py-2"
            id="description1"
            name="description"
            placeholder="Course description"
            required
            value={studentFormData.email}
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
