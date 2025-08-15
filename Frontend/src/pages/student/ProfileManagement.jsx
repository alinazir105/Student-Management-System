import { useState, useEffect } from "react";
import api from "../../../axiosInstance";

export default function ProfileManagement() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/api/student/profile');
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    password: ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.put('/api/student/profile', formData);
            if (response.status === 200) {
                setSuccess(true);
                setFormData({ ...formData, password: '' });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <section className="p-6 max-w-xl mx-auto min-h-screen">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Profile Management</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Profile updated successfully!</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 ${!edit && "bg-gray-100 cursor-not-allowed"}`}
                        required
                        readOnly={!edit}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="mt-1 block w-full border rounded-md p-2 text-sm bg-gray-100 cursor-not-allowed"
                        required
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={edit ? handleChange : undefined}
                        placeholder="Leave blank to keep current password"
                        className={`mt-1 block w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 ${!edit && "bg-gray-100 cursor-not-allowed"
                            }`}
                        readOnly={!edit}
                    />
                </div>

                <div className="flex justify-between items-center">
                    {edit && (
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setEdit(!edit)}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        {edit ? "Cancel Edit" : "Edit Profile"}
                    </button>
                </div>
            </form>
        </section>
    );
}
