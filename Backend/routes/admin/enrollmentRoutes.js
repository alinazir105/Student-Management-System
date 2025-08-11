import express from 'express'
import {enrollStudent, getEnrolledStudents, getEnrolledStudentsCount, getEnrollmentById, getEnrollmentCount, unenrollStudent, updateEnrollment} from '../../controllers/admin/enrollmentController.js'

const enrollmentRoutes = express.Router()

enrollmentRoutes.get('/', getEnrolledStudents)

enrollmentRoutes.get('/count', getEnrollmentCount)

enrollmentRoutes.get('/students/count', getEnrolledStudentsCount)

enrollmentRoutes.get('/:id', getEnrollmentById)

enrollmentRoutes.post('/', enrollStudent)

enrollmentRoutes.put('/:id', updateEnrollment)

enrollmentRoutes.delete('/:id', unenrollStudent)

export {enrollmentRoutes}