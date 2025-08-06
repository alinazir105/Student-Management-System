import pool from "../../db/pool.js"
import bcrypt from 'bcrypt'

export const getProfile = async (req, res) =>{
    try{
        const studentId = parseInt(req.user.id)

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [studentId])

        if(result.rowCount === 0){
            return res.status(404).json({error: "Student Not found"})
        }

        const {password, ...student} = result.rows[0]
        return res.status(200).json(student)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const updateProfile = async (req, res) =>{
    try{

        const studentId = parseInt(req.user.id)
        const {name, email, password} = req.body
    
        const updates = []
        const values = []
        let index = 1
    
        if(name){
            updates.push(`name = $${index}`)
            index ++
            values.push(name)
        }
    
        if(email){
            const existingUser = await pool.query(
                "SELECT * FROM users WHERE email = $1 AND id != $2",
                [email, studentId]
            )
            if(existingUser.rowCount > 0){
                return res.status(409).json({error: "Email is already in use"})
            }
    
            updates.push(`email = $${index}`)
            index ++
            values.push(email)
        }
    
        if(password){
            updates.push(`password = $${index}`)
            index ++
            const hashedPassword = await bcrypt.hash(password, 10)
            values.push(hashedPassword)
        }
    
        if(updates.length === 0){
            return res.status(400).json({error: "Nothing to update"})
        }
    
        values.push(studentId)
    
        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`

        const result = await pool.query(query, values)

        if(result.rowCount === 0){
            return res.status(404).json({error: "User not found"})
        }

        return res.status(200).json(result.rows[0])

    }
    catch(error){
        console.error(error)
        return res.status(500).json({error : "Internal Server Error"})
    }
}