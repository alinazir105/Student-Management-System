import express from 'express'
import { getCourseById, getCourses } from '../../controllers/student/studentCourseController.js'

const studentCourseRoutes = express.Router()

studentCourseRoutes.get('/', getCourses)

studentCourseRoutes.get('/:id', getCourseById)

export {studentCourseRoutes}