import express from 'express'
import { enrollCourse, getEnrolledCourses, getEnrollmentsCount, unenrollCourse } from '../../controllers/student/studentEnrollmentController.js'

const studentEnrollmentRoutes = express.Router()

studentEnrollmentRoutes.get('/count', getEnrollmentsCount)

studentEnrollmentRoutes.get('/', getEnrolledCourses)

studentEnrollmentRoutes.post('/', enrollCourse)

studentEnrollmentRoutes.delete('/:id', unenrollCourse)

export {studentEnrollmentRoutes}