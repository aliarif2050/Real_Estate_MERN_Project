import express from 'express'
import { test, updateUserProfile ,getUser1, verifyUser, deleteUser, getUser , getUserListings } from '../controllers/user.controller.js'

const router = express.Router()
router.get('/test', test)
router.get('/:id', verifyUser, getUser)
router.put('/:id', verifyUser, updateUserProfile)
router.delete('/:id', verifyUser, deleteUser)
router.get('/listing/:id', verifyUser, getUserListings)
router.get('/getUser/:id',verifyUser,getUser1)
export default router