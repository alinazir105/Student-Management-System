import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../axiosInstance";
import { Card, Button } from "flowbite-react";
import { HiUserGroup, HiBookOpen, HiClipboardList, HiUserAdd } from "react-icons/hi";
import EnrollmentPieChart from "./EnrollmentPieChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    enrolledStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, coursesRes, enrollmentsRes, enrolledStudentsRes] =
          await Promise.all([
            api.get("/api/admin/students/count"),
            api.get("/api/admin/courses/count"),
            api.get("/api/admin/enrollments/count"),
            api.get("/api/admin/enrollments/students/count")
          ]);

        setStats({
          students: studentsRes.data.count,
          courses: coursesRes.data.count,
          enrollments: enrollmentsRes.data.count,
          enrolledStudents: enrolledStudentsRes.data.count
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  const cards = [
    { label: "Total Students", value: stats.students, link: "/admin/students", icon: HiUserGroup },
    { label: "Total Courses", value: stats.courses, link: "/admin/courses", icon: HiBookOpen },
    { label: "Total Enrollments", value: stats.enrollments, link: "/admin/enrollments", icon: HiClipboardList },
    { label: "Unique Enrolled Students", value: stats.enrolledStudents, link: "/admin/students", icon: HiUserAdd }
  ];

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2 flex">
          <Button gradientDuoTone="greenToBlue" as={Link} to="/admin/students">
            Add Student
          </Button>
          <Button gradientDuoTone="purpleToPink" as={Link} to="/admin/courses">
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} href={card.link} className="hover:shadow-lg transition">
              <div className="flex items-center space-x-4 text-white">
                <Icon className="text-4xl text-blue-500" />
                <div>
                  <p className="text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mx-auto w-[30%]">
        <EnrollmentPieChart />
      </div>
      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Button outline gradientDuoTone="cyanToBlue" as={Link} to="/admin/students">
            Manage Students
          </Button>
          <Button outline gradientDuoTone="cyanToBlue" as={Link} to="/admin/courses">
            Manage Courses
          </Button>
          <Button outline gradientDuoTone="cyanToBlue" as={Link} to="/admin/enrollments">
            Manage Enrollments
          </Button>
        </div>
      </div>
    </div>
  );
}
