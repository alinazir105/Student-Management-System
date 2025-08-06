import { validateStudent } from "../utils/validateStudent.js"
import bcrypt from 'bcrypt'
import pool from "../db/pool.js"
import jwt from 'jsonwebtoken'

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"})
        }

        const existingStudent = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        if(existingStudent.rowCount === 0){
            return res.status(404).json({message: "Student not found"})
        }

        const passwordsMatch = await bcrypt.compare(password, existingStudent.rows[0].password)

        if(!passwordsMatch){
            return res.status(401).json({message: "Invalid password"})
        }

        const token = jwt.sign(
            {
                id: existingStudent.rows[0].id,
                name : existingStudent.rows[0].name,
                email: existingStudent.rows[0].email,
                role: existingStudent.rows[0].role
            },
            process.env.JWT_SECRET,
            {expiresIn : '1h'}
        )

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingStudent.rows[0].id,
                name: existingStudent.rows[0].name,
                email: existingStudent.rows[0].email,
                role: existingStudent.rows[0].role
            }
        } )

    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const signup = async (req, res) =>{
    try{
        const {name, email, password} = req.body

        const {isValid, error} = await validateStudent(name, email, password)

        if(!isValid){
            return res.status(400).json({error})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'student') RETURNING *",
            [name, email, hashedPassword]
        )

        

        const token = jwt.sign(
            {
            id: result.rows[0].id,
            name : result.rows[0].name,
            email : result.rows[0].email,
            role: result.rows[0].role 
        }, 
        process.env.JWT_SECRET, 
        {expiresIn : '1h'}
        ) 

        return res.status(201).json({
            message: "Signup successfull", 
            token ,
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                role: result.rows[0].role
            }})
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
}