import express from 'express'
import { signup, signin, google,signout ,check} from '../controllers/auth.controller.js'
const router = express.Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google',google)
router.post('/signout', signout)
router.get('/check', check);

export default router;
