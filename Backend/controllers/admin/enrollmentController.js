import pool from "../../db/pool.js"
import { validateEnrollment } from "../../utils/validateEnrollment.js"


export const getEnrolledStudents = async (req, res) => {
    try {
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
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getEnrollmentCount = async (req, res) => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM enrollments")
        return res.status(200).json({ count: parseInt(result.rows[0].count) })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getEnrolledStudentsCount = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(DISTINCT e.student_id) AS count 
             FROM enrollments e`
        )
        return res.status(200).json({ count: parseInt(result.rows[0].count) })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getStudentsPerCourse = async (req, res) => {
    try {
        const result = await pool.query(`
            select c.title, count(e.student_id) as "count" from courses c 
            left join enrollments e on c.id = e.course_id
            left join users s on e.student_id = s.id and s.role = 'student'
            group by c.title;
            `)
        return res.status(200).json(result.rows)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getEnrollmentById = async (req, res) => {
    try {
        const enrollmentId = parseInt(req.params.id);

        const result = await pool.query(
            `SELECT e.id, e.student_id, e.course_id, 
                    u.name AS student_name, c.title AS course_title
             FROM enrollments e
             JOIN users u ON e.student_id = u.id
             JOIN courses c ON e.course_id = c.id
             WHERE e.id = $1`,
            [enrollmentId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const enrollStudent = async (req, res) => {
    try {
        const studentId = parseInt(req.body.studentId)
        const courseId = parseInt(req.body.courseId)

        const { isValid, error } = await validateEnrollment(studentId, courseId)

        if (!isValid) {
            return res.status(400).json({ error })
        }

        const insertResult = await pool.query(
            "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
            [studentId, courseId]
        )

        if (insertResult.rowCount === 0) {
            return res.status(400).json({ error: "Failed to enroll student" })
        }

        const enrollmentId = insertResult.rows[0].id;

        const fullResult = await pool.query(
            `SELECT e.id, u.id AS student_id, u.name, u.email, c.title
             FROM users u
             JOIN enrollments e ON u.id = e.student_id
             JOIN courses c ON e.course_id = c.id
             WHERE e.id = $1`,
            [enrollmentId]
        );

        return res.status(201).json({ message: "Student enrolled successfully", enrollment: fullResult.rows[0] })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateEnrollment = async (req, res) => {
    try {
        const enrollmentId = parseInt(req.params.id)

        const studentId = parseInt(req.body.studentId)
        const courseId = parseInt(req.body.courseId)

        const { isValid, error } = await validateEnrollment(studentId, courseId)

        if (!isValid) {
            return res.status(400).json({ error })
        }

        const updateResult = await pool.query(
            "UPDATE enrollments SET student_id = $1, course_id = $2 WHERE id =$3 RETURNING *",
            [studentId, courseId, enrollmentId]
        )

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: "Invalid Enrollment Id" })
        }

        const fullResult = await pool.query(
            `SELECT e.id, u.id AS student_id, u.name, u.email, c.title
             FROM users u
             JOIN enrollments e ON u.id = e.student_id
             JOIN courses c ON e.course_id = c.id
             WHERE e.id = $1`,
            [enrollmentId]
        );
        return res.status(200).json({ message: "Enrollment updated successfully", enrollment: fullResult.rows[0] })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const unenrollStudent = async (req, res) => {

    try {
        const enrollmentId = parseInt(req.params.id)

        const result = await pool.query(
            "DELETE FROM enrollments WHERE id = $1 RETURNING *",
            [enrollmentId]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Invalid Enrollment Id" })
        }
        return res.status(200).json({
            message: "Student unenrolled successfully",
            enrollment: result.rows[0]
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
