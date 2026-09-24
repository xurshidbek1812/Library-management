import {getAllBooks, getBooksById, createBooks, editBooks, editBooksPartially, deleteBooks} from '../services/books.service.js'

export async function getBooks(req, res, next){
    try{
        const {category, author} = req.query
        let field = []
        let values = []
        let index = 1

        if(category){
            field.push(`category = $${index}`)
            values.push(category)
            index++
        }
        if(author){
            field.push(`author = $${index}`)
            values.push(author)
            index++
        }

        if(field.length === 0){
            const result = await getAllBooks()
            return res.json(result)
        }
        const result = await getAllBooks(field.join(', '), values)
        return res.json(result)

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function BooksById(req, res, next){
    try{
        const id = req.params.id
        if(Number.isNaN(Number(id)) || id < 1){
            return res.status(400).json({message: "ID must be a positive integer"})
        }
        const result = await getBooksById(Number(id))
        if(result.status){
            return res.json(result)
        }
        return res.status(400).json({message: `Book with the id ${id} not found`})
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

        return res.status(400).json({message: 'Could not create this book(check isbn, title, auth and category)'})

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function putBooks(req, res, next){
    try{
        const {isbn, title, published_year, price, num_copies, auth, category} = req.body
        const id = req.params.id
        if(Number.isNaN(Number(id)) || id < 1){
            return res.status(400).json({message: "ID must be a positive integer"})
        }

        const result = await editBooks(id, isbn, title, published_year, price, num_copies, auth, category)

        if(result.status){
            return res.json({message: "Book successfully updated", updated_book: result.updated_book})
        }

        return res.status(400).json({message: "Book not found"})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function patchBooks(req, res, next){
    try{
        let field = []
        let values = []
        let index = 1

        const {isbn, title, published_year, price, num_copies, auth, category} = req.body
        const id = req.params.id
        if(Number.isNaN(Number(id)) || id < 1){
            return res.status(400).json({message: "ID must be a positive integer"})
        }

        if(isbn){
            field.push(`isbn = $${index}`)
            values.push(isbn)
            index++
        }
        if(title){
            field.push(`title = $${index}`)
            values.push(title)
            index++
        }
        if(published_year){
            field.push(`published_year = $${index}`)
            values.push(published_year)
            index++
        }
        if(price){
            field.push(`price = $${index}`)
            values.push(price)
            index++
        }
        if(num_copies){
            field.push(`num_copies = $${index}`)
            values.push(num_copies)
            index++
        }
        if(auth){
            field.push(`auth = $${index}`)
            values.push(auth)
            index++
        }
        if(category){
            field.push(`category = $${index}`)
            values.push(category)
            index++
        }
        
        values.push(id)
        const result = await editBooksPartially(field.join(', '), values, index)

        if(result.status){
            return res.json({message: "Book successfully updated", updated_book: result.updated_book})
        }
        return res.status(400).json({message: "Book not found"})

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function delBooks(req, res, next){
    try{
        const id = req.params.id
        if(Number.isNaN(Number(id)) || id < 1){
            return res.status(400).json({message: "ID must be a positive integer"})
        }
        const result = await deleteBooks(id)
        if(result.status){
            return res.json({message: "Book successfully deleted", deleted_book: result.deleted_book})
        }
        return res.status(400).json({message: "Book not found"})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}