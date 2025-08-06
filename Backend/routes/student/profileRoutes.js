import express from "express";
import { getProfile, updateProfile } from "../../controllers/student/profileController.js";

const profileRoutes = express.Router()

profileRoutes.get('/', getProfile)

profileRoutes.put('/', updateProfile)

export {profileRoutes}