import express from 'express'
import { getStudents, getStudentById, addStudent, updateStudent, deleteStudent } from '../../controllers/admin/studentController.js'

const studentRoutes = express.Router()

studentRoutes.get('/', getStudents)

studentRoutes.get('/:id', getStudentById)

studentRoutes.post('/', addStudent)

studentRoutes.put('/:id', updateStudent)

studentRoutes.delete('/:id', deleteStudent)

export {studentRoutes}