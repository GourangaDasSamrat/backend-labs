import { Router } from "express";
import {handleUserSignUp} from '../controllers/user.controllers'

const router= Router()

// sign up
router.route('/signup').post(handleUserSignUp)

export default router