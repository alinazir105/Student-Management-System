import pool from "../../db/pool.js"
import { validateStudent } from "../../utils/validateStudent.js"
import bcrypt from 'bcrypt'



//student management functions
export const getStudents = async(req, res) =>{
    try{
        const result = await pool.query("SELECT * FROM users WHERE role = 'student'")

        return res.status(200).json(result.rows)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const getStudentById = async(req, res) =>{
    try{
        const id = parseInt(req.params.id)

        const result = await pool.query("SELECT * FROM users WHERE id = $1 AND role = 'student'", [id])

        if(result.rowCount === 0){
            return res.status(404).json({error: "Student not found"})
        }
        return res.status(200).json(result.rows[0])
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const addStudent = async(req, res)=>{

    try{
        const {name, email, password} = req.body
    
        //validate input
        const {isValid, error} = await validateStudent(name, email, password)
    
        if(!isValid){
            return res.status(400).json({error})
        }
        //hashing password to be implemented
        const hashedPassword = await bcrypt.hash(password, 10)
        //insert new student
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'student') RETURNING *",
            [name, email, hashedPassword]
        )

        if(result.rowCount === 0){
            return res.status(400).json({error: "Failed to add student"})
        }

        const {password: _password, ...newStudent} = result.rows[0]
        return res.status(201).json({message: "Student added successfully", newStudent})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}


export const updateStudent = async(req, res)=>{
    
    try{
        const id = parseInt(req.params.id)
    
        const {name, email, password} = req.body

        //validate input
        const {isValid, error} = await validateStudent(name, email, password, id)
        if(!isValid){
            return res.status(400).json({error})
        }

        // const hashedPassword = await bcrypt.hash(password, 10)
        //update student
        let query, values;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 AND role = 'student' RETURNING *";
            values = [name, email, hashedPassword, id];
        } else {
            query = "UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = 'student' RETURNING *";
            values = [name, email, id];
        }
        const result = await pool.query(query, values)

        if(result.rowCount === 0){
            return res.status(404).json({error: "Student not found"})
        }

        const {password: _password, ...updatedStudent} = result.rows[0]
        return res.status(200).json({message: "Student updated successfully", updatedStudent})
        
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const deleteStudent = async(req, res) => {
    try{
        const id = parseInt(req.params.id)

        //delete student
        const result = await pool.query("DELETE FROM users WHERE id = $1 AND role = 'student'", [id])
        if(result.rowCount === 0){
            return res.status(404).json({error: "Student not found"})
        }
        return res.status(200).json({message: "Student deleted successfully"})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}