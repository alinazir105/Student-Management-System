import pool from "../../db/pool.js";
import { validateEnrollment } from "../../utils/validateEnrollment.js";

export const getEnrolledCourses = async(req, res) =>{
    try{
        const studentId = parseInt(req.user.id)

        const result = await pool.query(
            `SELECT e.id,c.id, c.title, c.description FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            JOIN users u ON e.student_id = u.id
            WHERE u.id = $1`, [studentId])
        
        if(result.rowCount === 0){
            return res.status(404).json({error : "No enrolled courses found"})
        }

        return res.status(200).json(result.rows)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

export const enrollCourse = async(req, res) =>{
    try{
        const studentId = parseInt(req.user.id)
        const courseId = parseInt(req.body.courseId)

        const {isValid, error} = await validateEnrollment(studentId, courseId)
        
        if(!isValid){
            return res.status(400).json(error)
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

export const unenrollCourse = async(req, res) =>{
    try{
        const enrollmentId = req.params.id
        const studentId = req.user.id
        const result = await pool.query(
            "DELETE FROM enrollments WHERE id = $1 AND student_id = $2 RETURNING *", 
            [enrollmentId, studentId]
        )

        if(result.rowCount === 0){
            return res.status(404).json({error: "Enrollment not found"})
        }

        return res.status(200).json({message: "Unenrolled successfully", enrollment: result.rows[0]})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}