import express from 'express'
import { enrollCourse, getEnrolledCourses, unenrollCourse } from '../../controllers/student/studentEnrollmentController.js'

const studentEnrollmentRoutes = express.Router()

studentEnrollmentRoutes.get('/', getEnrolledCourses)

studentEnrollmentRoutes.post('/', enrollCourse)

studentEnrollmentRoutes.delete('/:id', unenrollCourse)

export {studentEnrollmentRoutes}