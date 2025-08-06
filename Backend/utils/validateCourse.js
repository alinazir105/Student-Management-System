import pool from "../db/pool.js"

export const validateCourse = async (title, description, id=null) =>{
    if(!title || title.trim() === "" || typeof title !== 'string'){
        return {isValid : false, error : "Title is required and must be a string"}
    }
    if(!description || description.trim() === "" || typeof description !== 'string'){
        return {isValid : false, error : "Description is required and must be a string"}
    }

    const existingCourse = await pool.query("SELECT * FROM courses WHERE title = $1", [title])
    if(existingCourse.rowCount > 0){
        if(existingCourse.rows[0].id !== id){
            return {isValid : false, error : "Course with this title already exists"}
        }
    }

    return {isValid : true}
}