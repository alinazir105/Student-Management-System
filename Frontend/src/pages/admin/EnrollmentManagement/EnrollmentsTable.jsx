import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import api from "../../../../axiosInstance";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function EnrollmentsTable(props) {
  const { enrollmentsData, setEnrollmentsData } = props;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('filter') || '';

  async function fetchEnrollments() {
    try {
      const res = await api.get(`/api/admin/enrollments?filter=${searchTerm}`);
      console.log(res.data.data)
      setEnrollmentsData(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    }
  }

  useEffect(() => {
    fetchEnrollments();
  }, [searchTerm]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/admin/enrollments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Enrollment deleted successfully");
      setEnrollmentsData((prev) => prev.filter((enrollment) => enrollment.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/enrollments/${id}`);
  }

  function handleChange(e){
    setSearchParams({ filter: e.target.value });
  }

  function generateTableRows() {
    return enrollmentsData.map((enrollment) => (
      <tr key={enrollment.id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-3 text-sm font-medium text-gray-900">{enrollment.id}</td>
        <td className="px-6 py-3 text-sm text-gray-900">{enrollment.student_id}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{enrollment.name}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{enrollment.email}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{enrollment.title}</td>

        <td className="px-6 py-3 text-sm text-center flex">
          <Button
            size="xs"
            color="blue"
            onClick={() => handleEdit(enrollment.id)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDelete(enrollment.id)}
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
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Enrollment Management</h1>

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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Student Email</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Course Title</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>

            </tr>
          </thead>
          <tbody>{generateTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
