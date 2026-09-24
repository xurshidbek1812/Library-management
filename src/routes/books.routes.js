import express from 'express'

import {getBooks, BooksById, postBooks, putBooks, patchBooks, delBooks} from '../controllers/books.controller.js'
import {validateBooks, validatePatchBooks} from '../validators/books.validator.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', BooksById)
router.post('/',validateBooks, postBooks)
router.put('/:id', validateBooks, putBooks)
router.patch('/:id', validatePatchBooks, patchBooks)
router.delete('/:id', delBooks)

export default router