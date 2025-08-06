import express from 'express'
import { login, signup } from '../controllers/authController.js'

export const authRoutes = express.Router()

authRoutes.post('/login', login)

authRoutes.post('/signup', signup)