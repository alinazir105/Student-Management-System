import pool from "../db/pool.js"

export const validateStudent = async (name, email, password, id) =>{
    if(!name || name.trim() === "" || typeof name !== 'string'){
        return {isValid : false, error : "Name is required and must be a string"}
    }

    if(!email || email.trim() === "" || typeof email !== 'string'){
        return {isValid : false, error : "Email is required and must be a string"}
    }

    if(!password || password.trim() === "" || typeof password !== 'string'){
        return {isValid : false, error : "Password is required and must be a string"}
    }
    
    const existingStudent = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if(existingStudent.rowCount > 0){
        if(id && existingStudent.rows[0].id === id){
            return {isValid : true}
        }
        else{
            return {isValid : false, error : "Student with this email already exists"}
        }
    }   

    return {isValid : true}
}