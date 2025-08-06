import express from 'express'
import {enrollStudent, getEnrolledStudents, unenrollStudent, updateEnrollment} from '../../controllers/admin/enrollmentController.js'

const enrollmentRoutes = express.Router()

enrollmentRoutes.get('/', getEnrolledStudents)

enrollmentRoutes.post('/', enrollStudent)

enrollmentRoutes.put('/:id', updateEnrollment)

enrollmentRoutes.delete('/:id', unenrollStudent)

export {enrollmentRoutes}