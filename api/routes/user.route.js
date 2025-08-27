import express from 'express'
import { test, updateUserProfile, verifyUser, deleteUser, getUser , getUserListings } from '../controllers/user.controller.js'

const router = express.Router()
router.get('/test', test)
router.get('/:id', verifyUser, getUser)
router.put('/:id', verifyUser, updateUserProfile)
router.delete('/:id', verifyUser, deleteUser)
router.get('/listing/:id', verifyUser, getUserListings)
export default router