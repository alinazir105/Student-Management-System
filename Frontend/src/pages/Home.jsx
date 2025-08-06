import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/Layout";
export default function Home() {
  const { user } = useContext(AuthContext)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Student Management System
      </h1>

      <p className="text-gray-600 text-lg max-w-lg text-center mb-8">
        Manage courses, students, and enrollments all in one place.
        Please log in to continue or create a new account to get started.
      </p>

      {
        !user && 
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Signup
          </Link>
        </div>
      }
    </div>
  );
};

