import express from 'express'

import {validateFilterStaff, validateStaffSignUp, validateStaffLogIn, validatePutStaff, validatePatchStaff} from '../validators/staff.validator.js'
import {getStaff, getStaffById, StaffSignUp, StaffLogIn, StaffPut, StaffPatch, restoreStaffUsers, deleteStaff} from '../controllers/staff.controller.js'

const router = express.Router()

router.get('/', validateFilterStaff, getStaff)
router.get('/:id', getStaffById)
router.post('/signup', validateStaffSignUp, StaffSignUp)
router.post('/login', validateStaffLogIn, StaffLogIn)
router.put('/:id', validatePutStaff, StaffPut)
router.patch('/:id', validatePatchStaff, StaffPatch)
router.patch('/restore/:id', restoreStaffUsers)
router.delete('/:id', deleteStaff)


export default router