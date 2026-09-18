import express from 'express'
import {validateSignupMemberInfo, validateLoginMemberInfo} from '../validators/members.validator.js'
import {signup, login} from '../controllers/members.controller.js'

const router = express.Router()

router.post('/signup', validateSignupMemberInfo, signup)
router.post('/login', validateLoginMemberInfo, login)

export default router