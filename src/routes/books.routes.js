import express from 'express'

import {getBooks, BooksById, postBooks} from '../controllers/books.controller.js'
import {validateBooks} from '../validators/books.validator.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', BooksById)
router.post('/',validateBooks, postBooks)

export default router