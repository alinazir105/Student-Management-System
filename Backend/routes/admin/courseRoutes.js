import express from 'express'
import {getCourses, addCourse, updateCourse, deleteCourse, getCourseById, getCourseCount} from '../../controllers/admin/courseController.js'

const courseRoutes = express.Router()

courseRoutes.get('/', getCourses)

courseRoutes.get('/count', getCourseCount)

courseRoutes.get('/:id', getCourseById)

courseRoutes.post('/', addCourse)

courseRoutes.put('/:id', updateCourse)

courseRoutes.delete('/:id', deleteCourse)

export {courseRoutes}