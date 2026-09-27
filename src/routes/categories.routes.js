import express from 'express'
import {validateCategoryName} from '../validators/categories.validator.js'
import {getAllCategories, get_categoriesById, post_categories, put_categories, delCategories} from '../controllers/categories.controller.js'
import {authorization, requireAdmin} from '../middleware/staff.middleware.js'

const router = express.Router()

router.get('/', getAllCategories)
router.get('/:id', get_categoriesById)
router.post('/', authorization, requireAdmin, validateCategoryName, post_categories)
router.put('/:id', authorization, requireAdmin, validateCategoryName, put_categories)
router.patch('/:id', authorization, requireAdmin, validateCategoryName, put_categories)
router.delete('/:id', authorization, requireAdmin, delCategories)

export default router