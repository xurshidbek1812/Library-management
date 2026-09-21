import express from 'express'

import {validateStaffSignUp, validateStaffLogIn} from '../validators/staff.validator.js'
import {StaffSignUp, StaffLogIn} from '../controllers/staff.controller.js'

const router = express.Router()

router.post('/signup', validateStaffSignUp, StaffSignUp)
router.post('/login', validateStaffLogIn, StaffLogIn)

export default router