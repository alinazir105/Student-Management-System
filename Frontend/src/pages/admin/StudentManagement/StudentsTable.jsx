import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import api from "../../../../axiosInstance";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function StudentsTable(props) {
  const { studentsData, setStudentsData } = props;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('filter') || '';

  function sanitizeStudents(students) {
    const sanitizedStudents = students.map(student => {
      const { password, ...rest } = student

      return rest
    })
    return sanitizedStudents
  }
  async function fetchStudents() {
    try {
      const res = await api.get(`/api/admin/students?filter=${searchTerm}`);
      const data = res.data
      const sanitizedData = sanitizeStudents(data)
      setStudentsData(sanitizedData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/api/admin/students/${id}`);
      setSuccess("Course deleted successfully");
      setStudentsData((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/students/${id}`);
  }

  function handleChange(e){
    setSearchParams({ filter: e.target.value });
  }

  function generateTableRows() {
    return studentsData.map((student) => (
      <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-3 text-sm font-medium text-gray-900">{student.id}</td>
        <td className="px-6 py-3 text-sm text-gray-900">{student.name}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{student.email}</td>
        <td className="px-6 py-3 text-sm text-center flex justify-center">
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

      <Link
        to="/admin"
        className="inline-block mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Student Management</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search courses..."
        className="border rounded-md p-2 w-full mb-2"
      />

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
