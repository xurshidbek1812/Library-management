import {getAllBooks, getBooksById, createBooks} from '../services/books.service.js'

export async function getBooks(req, res, next){
    try{
        const {category, author} = req.query

        if(category){
            if(author){
                const books = await getAllBooks(category, author)
                return res.json(books)
            }
            const books = await getAllBooks(category)
            return res.json(books)
        }

        const books = await getAllBooks()
        return res.json(books)

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function BooksById(req, res, next){
    try{
        const {id} = req.query
        if(Number.isNaN(Number(id))){
            throw new Error("Id must be a number")
        }
        const result = await getBooksById(Number(id))

        return res.json(result)
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function postBooks(req, res, next){
    try{

        const {isbn, title, published_year, price, num_copies, auth, category} = req.body

        const result = await createBooks(isbn, title, published_year, price, num_copies, auth, category)
        if(result.status){
            return res.status(201).json({message: 'Book successfully created', book: result.book})
        }

        if(result.reason == 'exists')
            return res.status(409).json({message: 'This book already exists'})

        return res.status(400).json({message: 'This author does not exist'})

    }
    catch(err){
        console.error(err)
        next(err)
    }
}