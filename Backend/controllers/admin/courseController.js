import pool from "../../db/pool.js"
import { validateCourse } from "../../utils/validateCourse.js"
//course management functions
export const getCourses = async(req, res) =>{
    try{
        const result = await pool.query("SELECT * FROM courses ORDER BY id")
        return res.status(200).json(result.rows)
    }
    catch(err){
        console.error(err)
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
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const addCourse = async(req, res)=>{
    try{
        const {title, description} = req.body
        console.log(req.body)
        console.log(description)
        //validate course
        const {isValid, error} = await validateCourse(title, description)

        if(!isValid){
            return res.status(400).json({error})
        }

        const result = await pool.query(
            "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        )
        if(result.rowCount === 0){
            return res.status(400).json({error: "Failed to add course"})
        }
        return res.status(201).json({message: "Course added successfully", course: result.rows[0]})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const updateCourse = async(req, res) =>{
    try{
        const {title, description} = req.body
        const id = parseInt(req.params.id)

        //validate course
        const {isValid, error} = await validateCourse(title, description, id)

        if(!isValid){
            return res.status(400).json({error})
        }

        //update course
        const result = await pool.query(
            "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description, id]
        )

        if(result.rowCount === 0){
            return res.status(404).json({error: "Course not found"})
        }
        return res.status(200).json({message: "Course updated successfully", course: result.rows[0]})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const deleteCourse = async(req, res)=>{
    try{
        const id = parseInt(req.params.id)
        
        const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id])

        if(result.rowCount === 0){
            return res.status(404).json({error: "Course not found"})
        }

        return res.status(200).json({message: "Course deleted successfully", deletedCourse: result.rows[0]})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}