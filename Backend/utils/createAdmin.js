import dotenv from 'dotenv'

dotenv.config()

import bcrypt from 'bcrypt'
import pool from "../db/pool.js"

const createAdmin = async() =>{
    try{
        const name = "Admin"
        const email = "admin@example.com"
        const password = "admin123"
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING *",
            [name, email, hashedPassword]
        )

        console.log("Admin created successfully:", result.rows[0])
    }
    catch(error){
        console.error("Error creating admin:", error.message)
    }
}

createAdmin()