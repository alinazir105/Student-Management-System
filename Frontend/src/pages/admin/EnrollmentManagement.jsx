import { Outlet } from "react-router-dom";
import EnrollmentsTable from "./EnrollmentManagement/EnrollmentsTable";
import { useState } from "react";

export default function EnrollmentManagemnnet (){
    const [enrollmentsData, setEnrollmentsData] = useState([])
    return(
        <section className="min-h-screen mb-24">
            <EnrollmentsTable enrollmentsData={enrollmentsData} setEnrollmentsData={setEnrollmentsData}  />
            <Outlet context={[enrollmentsData, setEnrollmentsData]} />
        </section>
    )
}