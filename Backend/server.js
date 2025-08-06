import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { adminRoutes } from './routes/adminRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { studentRoutes } from './routes/studentRoutes.js'

dotenv.config() // Load environment variables from .env file

const PORT = process.env.PORT || 8000
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))