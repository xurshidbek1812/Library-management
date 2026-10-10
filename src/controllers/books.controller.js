import {getAllBooks, getBooksById, createBooks, editBooks, checkIsbn, checkAuthor, checkCategory, editBooksPartially, restoreBook, deleteBooks} from '../services/books.service.js'

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
            field.push(`auth = $${index}`)
            values.push(author)
            index++
        }

        if(field.length === 0){
            const result = await getAllBooks()
            return res.json(result)
        }
        const result = await getAllBooks(field.join(' AND '), values)
        return res.json(result)

    }
    catch(err){
        next(err)
    }
}

export async function BooksById(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "ID must be a positive integer"})
        }
        const result = await getBooksById(Number(id))
        if(result.status){
            return res.json(result.book)
        }
        return res.status(400).json({message: `Book with the id ${id} not found`})
    }
    catch(err){
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
            return res.status(409).json({message: `Book with isbn ${isbn} already exists`})
        if(result.reason == 'deleted')
            return res.status(409).json({message: `Book with isbn ${isbn} has been deleted. You can restore it`})
        if(result.reason == 'author')
            return res.status(400).json({message: `Author with id ${auth} not found`})
        if(result.reason == 'category')
            return res.status(400).json({message: `Category with id ${category} not found`})

        return next(new Error(`Unhandled createBooks reason: ${result.reason}`))

    }
    catch(err){
        next(err)
    }
}

export async function putBooks(req, res, next){
    try{
        const {isbn, title, published_year, price, num_copies, auth, category} = req.body
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "ID must be a positive integer"})
        }
        const result = await editBooks(id, isbn, title, published_year, price, num_copies, auth, category)

        if(result.status){
            return res.json({message: "Book successfully updated", updated_book: result.updated_book})
        }

        if(result.reason == 'not found'){
            return res.status(400).json({message: `Book with id ${id} doesn't exists`})
        }
        if(result.reason == 'id deleted'){
            return res.status(409).json({message: `Book with id ${id} has been deleted. You can restore it`})
        }
        if(result.reason == 'exists'){
            return res.status(409).json({message: `Book with isbn ${isbn} already exists`})
        }
        if(result.reason == 'deleted'){
            return res.status(409).json({message: `Book with isbn ${isbn} has been deleted. You can restore it`})
        }
        if(result.reason == 'author'){
            return res.status(400).json({message: `Author with id ${auth} not found`})
        }
        if(result.reason == 'category'){
            return res.status(400).json({message: `Category with id ${category} not found`})
        }
        if(result.reason == 'just deleted'){
            return res.status(400).json({message: `Book with id ${category} has just been deleted by someone else`})
        }
        return next(new Error(`Unhandled createBooks reason: ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function patchBooks(req, res, next){
    try{
        let field = []
        let values = []
        let index = 1

        const {isbn, title, published_year, price, num_copies, auth, category} = req.body
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "ID must be a positive integer"})
        }

        if(isbn){
            const result = await checkIsbn(isbn)
            if(result.status){
                if(result.reason === 'exists'){
                    return res.status(409).json({message: `Book with isbn ${isbn} already exists`})
                }
                return res.status(409).json({message: `Book with isbn ${isbn} has been deleted. You can restore it`})
            }
            field.push(`isbn = $${index}`)
            values.push(isbn)
            index++
        }
        if(title){
            field.push(`title = $${index}`)
            values.push(title)
            index++
        }
        if(published_year !== undefined){
            field.push(`published_year = $${index}`)
            values.push(published_year)
            index++
        }
        if(price !== undefined){
            field.push(`price = $${index}`)
            values.push(price)
            index++
        }
        if(num_copies !== undefined){
            field.push(`num_copies = $${index}`)
            values.push(num_copies)
            index++
        }
        if(auth){
            const exists = await checkAuthor(auth)
            if(!exists){
                return res.status(400).json({message: `Author with id ${auth} doesn't exist`})
            }
            field.push(`auth = $${index}`)
            values.push(auth)
            index++
        }
        if(category){
            const exists = await checkCategory(category)
            if(!exists){
                return res.status(400).json({message: `Category with id ${category} doesn't exist`})
            }
            field.push(`category = $${index}`)
            values.push(category)
            index++
        }

        if(field.length === 0){
            return res.status(400).json({message: "Nothing is provided to update"})
        }
        
        values.push(id)
        const result = await editBooksPartially(field.join(', '), values, index)

        if(result.status){
            return res.json({message: "Book successfully updated", updated_book: result.updated_book})
        }
        return res.status(400).json({message: "Book not found"})

    }
    catch(err){
        next(err)
    }
}

export async function restoreBooks(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: `Id must be a positive integer`})
        }

        const result = await restoreBook(id)
        if(result.status){
            return res.json({message: `Book successfully restored`, restored_book: result.restored_book})
        }

        if(result.reason == 'active'){
            return res.status(409).json({message: `Book with id ${id} already exists`})
        }
        if(result.reason == 'not found'){
            return res.status(400).json({message: `Book with id ${id} doesn't exist`})
        }
        if(result.reason == 'just deleted'){
            return res.status(409).json({message: `Book with id ${id} has just been restored by someone else`})
        }
        return next(new Error(`Unhandled restoreBooks reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function delBooks(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "ID must be a positive integer"})
        }
        const result = await deleteBooks(id)
        if(result.status){
            return res.json({message: "Book successfully deleted", deleted_book: result.deleted_book})
        }
        return res.status(400).json({message: "Book not found"})
    }
    catch(err){
        next(err)
    }
}