import express from 'express'
import {getLoans, getLoansById, postLoans, putLoans, patchLoans, closeLoans, undoCloseLoans, restoreLoans, deleteLoans} from '../controllers/loans.controller.js'
import {validateFilterLoans, validatePostLoans, validatePutLoans, validatePatchLoans} from '../validators/loans.validator.js'
import {authorization, requireStaff} from '../middleware/staff.middleware.js'

const router = express.Router()

router.get('/', validateFilterLoans, getLoans)
router.get('/:id', getLoansById)
router.post('/', authorization, requireStaff, validatePostLoans, postLoans)
router.put('/:id', authorization, requireStaff, validatePutLoans, putLoans)
router.patch('/:id', authorization, requireStaff, validatePatchLoans, patchLoans)
router.patch('/close/:id', authorization, requireStaff, closeLoans)
router.patch('/undoClose/:id', authorization, requireStaff, undoCloseLoans)
router.patch('/restore/:id', authorization, requireStaff, restoreLoans)
router.delete('/:id', authorization, requireStaff, deleteLoans)


export default router