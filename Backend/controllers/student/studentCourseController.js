import pool from "../../db/pool.js"

export const getCourses = async(req, res) =>{
    try{
        const studentId = parseInt(req.user.id)
        
        const searchTerm = req.query.filter || '';
        if(searchTerm){
            const result = await pool.query(
                `SELECT c.*, 
                CASE WHEN e.student_id IS NULL THEN false ELSE true END AS enrolled 
                FROM courses c
                LEFT JOIN enrollments e ON c.id = e.course_id AND e.student_id = $1
                WHERE c.title LIKE $2 OR c.description LIKE $2`,
                [studentId, `%${searchTerm}%`]
            )
            return res.status(200).json(result.rows)
        }

        const result = await pool.query(
            `SELECT c.*, 
            CASE WHEN e.student_id IS NULL THEN false ELSE true END AS enrolled 
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id AND e.student_id = $1`
            ,
            [studentId]
        )

        return res.status(200).json(result.rows)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}


export const getCourseById = async(req, res) =>{
    try{
        const id = parseInt(req.params.id)

        const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id])

        if(result.rowCount === 0){
            return res.status(404).json({error: "Course not found"})
        }

        return res.status(200).json(result.rows[0])
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}