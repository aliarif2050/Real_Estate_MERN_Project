import express from 'express'
import { test, updateUserProfile } from '../controllers/user.controller.js'

const router = express.Router()
router.get('/test', test)
router.put('/:id', updateUserProfile)
export default router