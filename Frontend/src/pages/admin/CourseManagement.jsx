import CourseTable from "./CourseManagement/CourseTable"
import AddEditCourseForm from "./CourseManagement/AddEditCourseForm"
import { Outlet } from "react-router-dom"
import { useState } from "react"
export default function CourseManagement() {
  const [coursesData, setCoursesData] = useState([]);
    return (
        <section className="h-screen mb-24">
            <CourseTable coursesData={coursesData} setCoursesData={setCoursesData} />
            <Outlet context={[coursesData, setCoursesData]} />
        </section>
    )
}