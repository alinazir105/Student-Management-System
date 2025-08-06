import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'
import { studentCourseRoutes } from './student/studentCourseRoutes.js'
import { profileRoutes } from './student/profileRoutes.js'
import { studentEnrollmentRoutes } from './student/studentEnrollmentRoutes.js'

const studentRoutes = express.Router()

studentRoutes.use(verifyToken)
studentRoutes.use(authorizeRoles("student"))

//student's course management
studentRoutes.use('/courses', studentCourseRoutes)

//profile managemnet routes
studentRoutes.use('/profile', profileRoutes)

//enrollment management routes
studentRoutes.use('/enrollments', studentEnrollmentRoutes)

export {studentRoutes}