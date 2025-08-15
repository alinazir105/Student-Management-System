import { useState, useEffect } from 'react';
import api from '../../../axiosInstance';
import { Button } from 'flowbite-react';
import { useSearchParams } from 'react-router-dom';

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('filter') || '';
    const enrolledCoursesCount = courses.filter(course => course.enrolled).length
    const maxCourses = 5

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(`/api/student/courses?filter=${searchTerm}`);
                console.log("Courses fetched:", response.data);
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [searchTerm]);

    function handleChange(e){
        setSearchParams({filter : e.target.value})
    }

    async function handleEnroll(id) {
        try {
            const response = await api.post(`/api/student/enrollments`, { courseId: id });
            if (response.status === 201) {
                setCourses(courses.map(course =>
                    course.id === id ? { ...course, enrolled: true } : course
                ));
            }
        } catch (error) {
            console.error("Error enrolling in course:", error);
            setError("Failed to enroll in the course. Please try again later.");
        }
    }

    function renderCourses() {
        if (courses.length === 0) {
            return (
                <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">
                        No courses available
                    </td>
                </tr>
            );
        }
        return courses.map(course => (
            <tr
                key={course.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
                <td className="px-4 py-3 text-sm text-gray-700">{course.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.description}</td>
                <td className="px-4 py-3 text-sm">
                    <Button
                        size="xs"
                        color={course.enrolled ? "success" : "blue"}
                        onClick={() => handleEnroll(course.id)}
                        disabled={course.enrolled || enrolledCoursesCount >= maxCourses}
                    >
                        {course.enrolled ? "Enrolled" : "Enroll"}
                    </Button>
                </td>
            </tr>
        ));
    }

    if (loading) {
        return <p className="text-center py-8 text-gray-500 text-sm">Loading courses...</p>;
    }

    if (error) {
        return <p className="text-center py-8 text-red-500 text-sm">{error}</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <h1 className="text-xl font-semibold mb-6 text-gray-800">Available Courses</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search courses..."
                className="border rounded-md p-2 w-full mb-2"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCourses()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
