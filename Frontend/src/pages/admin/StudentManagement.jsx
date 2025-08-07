import {useState} from 'react'
import {Outlet} from 'react-router-dom'
import AddEditStudentForm from "./StudentManagement/AddEditStudentForm";
import StudentsTable from "./StudentManagement/StudentsTable";

export default function StudentManagement(){
  const [studentsData, setStudentsData] = useState([]);
    return(
        <section className="min-h-screen mb-24">
            <StudentsTable studentsData={studentsData} setStudentsData={setStudentsData} />
            <Outlet context={[studentsData, setStudentsData]} />
        </section>
    )
}