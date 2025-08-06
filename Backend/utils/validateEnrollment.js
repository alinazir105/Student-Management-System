import pool from "../db/pool.js"

export const validateEnrollment = async (studentId, courseId) => {

    if (!courseId || typeof courseId !== 'number') {
        return { isValid: false, error: "Course ID is required and must be a number" }
    }

    if (!studentId || typeof studentId !== 'number') {
        return { isValid: false, error: "Student ID is required and must be a number" }
    }

    const existingStudent = await pool.query("SELECT * FROM users WHERE id = $1 AND role = 'student'", [studentId])
    if(existingStudent.rowCount === 0){
        return {isValid : false, error: "Invalid Student Id"}
    }

    const existingCourse = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId])
    if(existingCourse.rowCount === 0){
        return {isValid : false, error: "Invalid Course Id"}
    }

    const existingEnrollment = await pool.query(
        "SELECT * FROM enrollments WHERE course_id = $1 AND student_id = $2",
        [courseId, studentId]
    )

    if (existingEnrollment.rowCount > 0) {
        return { isValid: false, error: "Student is already enrolled in this course" }
    }

    return { isValid: true }
}