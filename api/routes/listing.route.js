import express from 'express'
import { createListing, deleteListing, updateListing, getListing} from '../controllers/listing.controller.js'
import { verifyUser } from '../controllers/user.controller.js'
const router = express.Router()

router.post('/create', createListing)
router.delete('/:id', verifyUser, deleteListing)
router.put('/update/:id', verifyUser, updateListing)
router.get('/get/:id', getListing)
export default router