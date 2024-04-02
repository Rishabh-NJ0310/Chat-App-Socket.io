import express from 'express'
import {login, signup, loginout} from '../controller/authController.js'
const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", loginout);


export default router;  