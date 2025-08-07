import { Button, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import api from "../../../../axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CourseTable(props) {
  const {coursesData, setCoursesData} = props;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function fetchCourses() {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setCoursesData(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Course deleted successfully");
      setCoursesData((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/courses/${id}`);
  }

  function generateTableRows() {
    return coursesData.map((course) => (
      <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-3 text-sm font-medium text-gray-900">{course.id}</td>
        <td className="px-6 py-3 text-sm text-gray-900">{course.title}</td>
        <td className="px-6 py-3 text-sm text-gray-500">{course.description}</td>
        <td className="px-6 py-3 text-sm text-center flex">
          <Button
            size="xs"
            color="blue"
            onClick={() => handleEdit(course.id)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDelete(course.id)}
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>{generateTableRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
