import express from 'express'

import {getAuthorById, getAllAuth, createAuthor, editAuthor, editPartiallyAuthor, restoreAuthors, delAuthor} from '../controllers/authors.controller.js'
import {validateCreateAuthor, validateEditAuthor, validateEditPartiallyAuthor} from '../validators/authors.validator.js'
import {authorization, requireAdmin} from '../middleware/staff.middleware.js'

const router = express.Router()

router.get('/', getAllAuth)
router.get('/:id', getAuthorById)
router.post('/', authorization, requireAdmin, validateCreateAuthor, createAuthor)
router.put('/:id', authorization, requireAdmin, validateEditAuthor, editAuthor)
router.patch('/:id', authorization, requireAdmin, validateEditPartiallyAuthor, editPartiallyAuthor)
router.patch('/restore/:id', authorization, requireAdmin, restoreAuthors)
router.delete('/:id', authorization, requireAdmin, delAuthor)

export default router