import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { Card, Button } from "flowbite-react";
import { HiBookOpen, HiClipboardList } from "react-icons/hi";
import { MdOutlineSchool } from "react-icons/md";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    availableCourses: 0,
    enrolledCourses: 0,
  });
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [availableRes, enrolledRes] = await Promise.all([
          api.get("/api/student/courses/count"),
          api.get("/api/student/enrollments/count"),
        ]);
        console.log("Available Courses:", availableRes.data);
        console.log("Enrolled Courses:", enrolledRes.data);
        setStats({
          availableCourses: availableRes.data.count,
          enrolledCourses: enrolledRes.data.count,
        });
      } catch (err) {
        console.error("Error fetching student dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-600">Loading dashboard...</p>;

  const cards = [
    { label: "Available Courses", value: stats.availableCourses, link: "/student/courses", icon: HiBookOpen },
    { label: "My Enrollments", value: stats.enrolledCourses, link: "/student/enrollments", icon: HiClipboardList },
  ];

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div>
          <Button as={Link} to="/student/courses">
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} href={card.link} className="hover:shadow-lg transition">
              <div className="flex items-center space-x-4">
                <Icon className="text-4xl text-blue-500" />
                <div>
                  <p className="text-gray-200">{card.label}</p>
                  <p className="text-2xl text-white font-bold">{card.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Button outline as={Link} to="/student/profile">
            Manage Profile
          </Button>
          <Button outline as={Link} to="/student/enrollments">
            My Enrollments
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <MdOutlineSchool className="text-blue-500" />
          Welcome Student 👋
        </h2>
        <p className="text-gray-600 mt-2">
          Explore available courses, enroll in new ones, and manage your learning journey here.
        </p>
      </div>
    </div>
  );
}
