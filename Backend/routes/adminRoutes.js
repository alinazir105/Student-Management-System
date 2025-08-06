import express from 'express';
import { courseRoutes } from './admin/courseRoutes.js';
import { studentRoutes } from './admin/studentRoutes.js';
import { enrollmentRoutes } from './admin/enrollmentRoutes.js';
import {verifyToken} from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const adminRoutes = express.Router();

adminRoutes.use(verifyToken)
adminRoutes.use(authorizeRoles('admin'))
//course management routes
adminRoutes.use('/courses', courseRoutes)


//student management routes
adminRoutes.use('/students', studentRoutes)


//enrollment mangement routes
adminRoutes.use('/enrollments', enrollmentRoutes)

export {adminRoutes}