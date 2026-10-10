import express from 'express'
import {validateFilterMember, validateSignupMemberInfo, validateLoginMemberInfo, validatePutMember, validatePatchMember} from '../validators/members.validator.js'
import {getMembers, getMembersById, getMemberLoans, signup, login, borrowBook, returnBook, putMembers, patchMember, activateMember, deleteMember} from '../controllers/members.controller.js'
import {authorization, requireStaff} from '../middleware/staff.middleware.js'
import {memberAuthorization} from '../middleware/members.middleware.js'

const router = express.Router()

router.get('/loans', memberAuthorization, getMemberLoans)
router.get('/', authorization, requireStaff, validateFilterMember, getMembers)
router.get('/:id', authorization, requireStaff, getMembersById)
router.post('/signup', validateSignupMemberInfo, signup)
router.post('/login', validateLoginMemberInfo, login)
router.post('/borrow/:book_id', memberAuthorization, borrowBook)
router.put('/:id', authorization, requireStaff, validatePutMember, putMembers)
router.patch('/:id', authorization, requireStaff, validatePatchMember, patchMember)
router.patch('/restore/:id', authorization, requireStaff, activateMember)
router.patch('/return/:id', memberAuthorization, returnBook)
router.delete('/:id', authorization, requireStaff, deleteMember)

export default router