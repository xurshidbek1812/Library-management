import express from 'express'

import {validateFilterStaff, validateStaffSignUp, validateStaffLogIn, validatePutStaff, validatePatchStaff} from '../validators/staff.validator.js'
import {getStaff, getStaffById, StaffSignUp, StaffLogIn, StaffPut, StaffPatch, restoreStaffUsers, deleteStaff} from '../controllers/staff.controller.js'
import {authorization, requireAdmin} from '../middleware/staff.middleware.js'

const router = express.Router()

router.get('/', authorization, requireAdmin, validateFilterStaff, getStaff)
router.get('/:id', authorization, requireAdmin, getStaffById)
router.post('/signup', authorization, requireAdmin, validateStaffSignUp, StaffSignUp)
router.post('/login', validateStaffLogIn, StaffLogIn)
router.put('/:id', authorization, requireAdmin, validatePutStaff, StaffPut)
router.patch('/:id', authorization, requireAdmin, validatePatchStaff, StaffPatch)
router.patch('/restore/:id', authorization, requireAdmin, restoreStaffUsers)
router.delete('/:id', authorization, requireAdmin, deleteStaff)


export default router