import express from 'express'
import { getCourseById, getCourses, getCoursesCount } from '../../controllers/student/studentCourseController.js'

const studentCourseRoutes = express.Router()

studentCourseRoutes.get('/count', getCoursesCount)

studentCourseRoutes.get('/', getCourses)

studentCourseRoutes.get('/:id', getCourseById)

export {studentCourseRoutes}