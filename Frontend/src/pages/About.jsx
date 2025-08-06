import React from "react";

export default function About () {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col gap-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About This System</h1>
        <p className="text-gray-700 text-lg">
          The Student Course Management System is built to give admins and students
          a simple, secure, and flexible interface to manage courses, enrollments,
          and profiles. It’s designed to focus on backend robustness while providing
          just enough frontend clarity to get work done.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-600">
            To empower learning and administration with a clean, role-based system
            that scales from small demos to real deployments. We emphasize security,
            clarity, and practicality.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>JWT-based authentication & role authorization</li>
            <li>Admin CRUD for courses, students, enrollments</li>
            <li>Student self-service enrollment and profile management</li>
            <li>Minimal, extensible frontend</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


