import express from 'express'
import { createListing, deleteListing } from '../controllers/listing.controller.js'
import { verifyUser } from '../controllers/user.controller.js'
const router = express.Router()

router.post('/create', createListing)
router.delete('/:id', verifyUser, deleteListing)
export default router