import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import api from "../../../../axiosInstance";
import { useNavigate } from "react-router-dom";

export default function StudentsTable(props) {
  const {studentsData, setStudentsData} = props;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function sanitizeStudents(students){
    const sanitizedStudents = students.map(student => {
      const {password, ...rest} = student

      return rest
    })
    return sanitizedStudents
  }
  async function fetchStudents() {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data
      const sanitizedData = sanitizeStudents(data)
      setStudentsData(sanitizedData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Course deleted successfully");
      setStudentsData((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/students/${id}`);
  }

  function generateTableRows() {
    return studentsData.map((student) => (
      <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-3 text-sm font-medium text-gray-900">{student.id}</td>
        <td className="px-6 py-3 text-sm text-gray-900">{student.name}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{student.email}</td>
        <td className="px-6 py-3 text-sm text-center flex">
          <Button
            size="xs"
            color="blue"
            onClick={() => handleEdit(student.id)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDelete(student.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
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

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>{generateTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
