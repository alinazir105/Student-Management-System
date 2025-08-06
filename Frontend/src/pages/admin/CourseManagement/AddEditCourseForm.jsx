import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Toast } from "flowbite-react";
import api from "../../../../axiosInstance";

export default function AddEditCourseForm() {
    const [coursesData, setCoursesData] = useOutletContext()
    const [courseFormData, setCourseFormData] = useState({
        title: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        async function fetchCourseDetails() {
            try {
                const res = await api.get(`/api/admin/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourseFormData({
                    title: res.data.title,
                    description: res.data.description,
                });
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch course");
            }
        }
        if (id) fetchCourseDetails();
    }, [id]);

    function handleChange(e) {
        setCourseFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            if (id) {
                await api.put(`/api/admin/courses/${id}`, courseFormData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess("Course updated successfully");
            } else {
                await api.post("/api/admin/courses", courseFormData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess("Course added successfully");
            }

            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            setError(error.response?.data?.message || "Operation failed");
        }
    }

    return (
        <div className="flex items-center">
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
                className="rounded-2xl shadow-2xl px-4 py-12 mx-auto justify-center flex w-[90%] lg:w-[40%] flex-col gap-4 border"
            >
                <h1 className="text-4xl font-bold">
                    {id ? "Edit Course" : "Add Course"}
                </h1>

                <div>
                    <label htmlFor="title1" className="text-black mb-2 block">
                        Course Title
                    </label>
                    <input
                        className="border w-full rounded-lg px-4 py-2"
                        id="title1"
                        type="text"
                        name="title"
                        required
                        value={courseFormData.title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="description1" className="text-black mb-2 block">
                        Course Description
                    </label>
                    <textarea
                        className="border w-full rounded-lg px-4 py-2"
                        id="description1"
                        name="description"
                        required
                        value={courseFormData.description}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">{id ? "Update Course" : "Create Course"}</Button>
            </form>
        </div>
    );
}
