import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Toast } from "flowbite-react";
import api from "../../../../axiosInstance";

export default function AddEditEnrollmentForm() {
    const [enrollmentsData, setEnrollmentsData] = useOutletContext()
    const [enrollmentFormData, setEnrollmentFormData] = useState({
        student_id : "",
        course_id : "" ,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { id } = useParams();
    const enrollmentId = Number(id)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        async function fetchEnrollmentDetails() {
            try {
                const res = await api.get(`/api/admin/enrollments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEnrollmentFormData({
                    student_id: res.data.student_id.toString(),
                    course_id: res.data.course_id.toString(),
                });
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch course");
            }
        }
        if (id) fetchEnrollmentDetails();
    }, [id]);

    function handleChange(e) {
        setEnrollmentFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (id) {
                const payload = {
                    studentId: parseInt(enrollmentFormData.student_id),
                    courseId: parseInt(enrollmentFormData.course_id),
                }
                const res = await api.put(`/api/admin/enrollments/${id}`, payload);
                const updatedEnrollment = res.data.enrollment;

                setEnrollmentsData(prev => prev.map(enrollment => 
                    enrollment.id === enrollmentId? updatedEnrollment: enrollment)
                )
                setSuccess("Enrollment updated successfully");
                setEnrollmentFormData({student_id:"", course_id:""})
                setTimeout(() => navigate("/admin/enrollments"), 1500);
            } else {
                const payload = {
                    studentId: parseInt(enrollmentFormData.student_id),
                    courseId: parseInt(enrollmentFormData.course_id),
                }
                const res = await api.post("/api/admin/enrollments", payload);
                const data = res.data.enrollment
                setEnrollmentsData(prev => [...prev, data])
                setSuccess("Enrollment added successfully");
                setEnrollmentFormData({student_id:"", course_id:""})

            }

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
                    {id ? "Edit Enrollment" : "Add Enrollment"}
                </h1>

                <div>
                    <label htmlFor="student_id1" className="text-black mb-2 block">
                        Student Id
                    </label>
                    <input
                        className="border w-full rounded-lg px-4 py-2"
                        id="student_id1"
                        type="number"
                        name="student_id"
                        required
                        value={enrollmentFormData.student_id}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="course_id1" className="text-black mb-2 block">
                        Course Id
                    </label>
                    <input
                        className="border w-full rounded-lg px-4 py-2"
                        id="course_id1"
                        name="course_id"
                        type="number"
                        required
                        value={enrollmentFormData.course_id}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">{id ? "Update Enrollment" : "Create Enrollment"}</Button>
            </form>
        </div>
    );
}
