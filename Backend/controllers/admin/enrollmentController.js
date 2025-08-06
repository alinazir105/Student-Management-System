import pool from "../../db/pool.js"
import { validateEnrollment } from "../../utils/validateEnrollment.js"


export const getEnrolledStudents = async (req, res) => {
    try{
        const result = await pool.query(
            `SELECT e.id, u.id AS student_id, u.name, u.email, c.title FROM users u 
            JOIN enrollments e ON u.id = e.student_id 
            JOIN courses c ON e.course_id = c.id`
        )

        return res.status(200).json({
            message: "Enrolled students fetched successfully",
            data: result.rows
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const enrollStudent = async(req, res) =>{
    try{
        const studentId = parseInt(req.body.studentId)
        const courseId = parseInt(req.body.courseId)

        const {isValid, error} = await validateEnrollment(studentId, courseId)

        if(!isValid){
            return res.status(400).json({error})
        }

        const result = await pool.query(
            "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
            [studentId, courseId]
        )
        
        if(result.rowCount === 0){
            return res.status(400).json({error: "Failed to enroll student"})
        }

        return res.status(201).json({message: "Student enrolled successfully", enrollment: result.rows[0]})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const updateEnrollment = async(req, res) =>{
    try{
        const enrollmentId = parseInt(req.params.id)
    
        const studentId = parseInt(req.body.studentId)
        const courseId = parseInt(req.body.courseId)

        const {isValid, error} = await validateEnrollment(studentId, courseId)

        if(!isValid){
            return res.status(400).json({error})
        }

        const result = await pool.query(
            "UPDATE enrollments SET student_id = $1, course_id = $2 WHERE id =$3 RETURNING *",
            [studentId, courseId, enrollmentId]
        )

        if(result.rowCount === 0){
            return res.status(404).json({error: "Invalid Enrollment Id"})
        }

        return res.status(200).json({message: "Enrollment updated successfully", enrollment: result.rows[0]})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const unenrollStudent = async(req, res) =>{

    try{
        const enrollmentId = parseInt(req.params.id)

        const result = await pool.query(
            "DELETE FROM enrollments WHERE id = $1 RETURNING *",
            [enrollmentId]
        )

        if(result.rowCount === 0){
            return res.status(404).json({error: "Invalid Enrollment Id"})
        }
        return res.status(200).json({
            message: "Student unenrolled successfully",
            enrollment: result.rows[0]
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}