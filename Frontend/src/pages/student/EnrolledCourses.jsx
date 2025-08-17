import { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchEnrolledCourses() {
            try {
                setError(null); // reset errors on new fetch
                const response = await api.get("/api/student/enrollments");
                console.log("Enrolled courses fetched:", response.data);
                setEnrolledCourses(response.data);
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError("Failed to load enrolled courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchEnrolledCourses();
    }, []);

    async function handleUnenroll(courseId) {
        try {
            setError(null); // reset errors before unenroll
            const response = await api.delete(`/api/student/enrollments/${courseId}`);
            if (response.status === 200) {
                setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
            }
        } catch (error) {
            console.error("Error unenrolling from course:", error);
            setError("Failed to unenroll from the course. Please try again later.");
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Loading...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }
    if (enrolledCourses.length === 0) {
        return <div className="text-center py-10 text-gray-600">No enrolled courses found</div>;
    }

    return (
        <section className="p-6 max-w-4xl mx-auto">
            <Link
                to="/student"
                className="inline-block mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Enrolled Courses</h1>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 border">Enrollment Id</th>
                            <th className="px-4 py-3 border">Course Id</th>
                            <th className="px-4 py-3 border">Course Title</th>
                            <th className="px-4 py-3 border">Description</th>
                            <th className="px-4 py-3 border text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolledCourses.map(course => (
                            <tr key={course.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{course.id}</td>
                                <td className="px-4 py-3">{course.course_id}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{course.title}</td>
                                <td className="px-4 py-3 text-gray-600">{course.description}</td>
                                <td className="px-4 py-3 text-center">
                                    <Button
                                        color="red"
                                        size="xs"
                                        onClick={() => handleUnenroll(course.id)}
                                    >
                                        Unenroll
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
