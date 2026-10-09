import express from 'express'

import {getBooks, BooksById, postBooks, putBooks, patchBooks, restoreBooks, delBooks} from '../controllers/books.controller.js'
import {validateFilterBooks, validateBooks, validatePatchBooks} from '../validators/books.validator.js'
import {authorization, requireStaff} from '../middleware/staff.middleware.js'

const router = express.Router()

router.get('/', validateFilterBooks, getBooks)
router.get('/:id', BooksById)
router.post('/', authorization, requireStaff, validateBooks, postBooks)
router.put('/:id', authorization, requireStaff, validateBooks, putBooks)
router.patch('/:id', authorization, requireStaff, validatePatchBooks, patchBooks)
router.patch('/restore/:id', authorization, requireStaff, restoreBooks)
router.delete('/:id', authorization, requireStaff, delBooks)

export default router