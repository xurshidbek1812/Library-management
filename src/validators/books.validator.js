export async function validateFilterBooks(req, res, next){
    const {isbn, title, published_year, price, num_copies, auth, category} = req.query

    if(isbn && (typeof isbn !== 'string' || isbn.length > 20 || isbn.length < 13)){
        return res.status(400).json({message: 'isbn must be string containing 13-20 charecters'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(published_year && (!Number.isInteger(published_year) || published_year < 1000 || published_year > new Date().getFullYear())){
        return res.status(400).json({message: 'published_year must valid integer year'})
    }
    if(price && (typeof price !== 'number' || price <= 0)){
        return res.status(400).json({message: 'price must be a positive number'})
    }
    if(num_copies && (!Number.isInteger(num_copies) || num_copies < 0)){
        return res.status(400).json({message: 'num_copies must be a positive integer'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(auth && (!Number.isInteger(Number(auth)) || Number(auth) <= 0)){
        return res.status(400).json({message: 'auth must be a positive integer'})
    }
    if(category && (!Number.isInteger(Number(category)) || Number(category) <= 0)){
        return res.status(400).json({message: 'category must be a positive integer'})
    }
    next() 
}

export function validateBooks(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "req.body is not provided"})
    }
    const {isbn, title, published_year, price, num_copies, auth, category} = req.body

    if(!isbn || typeof isbn !== 'string' || isbn.length > 20 || isbn.length < 13){
        return res.status(400).json({message: 'isbn must be string containing 13-20 charecters'})
    }
    if(!title || typeof title !== 'string' || title.length === 0){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(!published_year || !Number.isInteger(published_year) || published_year < 1000 || published_year > new Date().getFullYear()){
        return res.status(400).json({message: 'published_year must be valid integer year'})
    }
    if(!price || typeof price !== 'number' || price <= 0){
        return res.status(400).json({message: 'price must be a positive number'})
    }
    if(!num_copies || !Number.isInteger(num_copies) || num_copies < 0){
        return res.status(400).json({message: 'num_copies must be a positive integer'})
    }
    if(!title || typeof title !== 'string' || title.length === 0){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(!auth || !Number.isInteger(auth) || auth <= 0){
        return res.status(400).json({message: 'auth must be a positive integer'})
    }
    if(!category || !Number.isInteger(category) || category <= 0){
        return res.status(400).json({message: 'category must be a positive integer'})
    }
    next()
}

export function validatePatchBooks(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "req.body is not provided"})
    }
    const {isbn, title, published_year, price, num_copies, auth, category} = req.body

    if(isbn && (typeof isbn !== 'string' || isbn.length > 20 || isbn.length < 13)){
        return res.status(400).json({message: 'isbn must be string containing 13-20 charecters'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(published_year && (!Number.isInteger(published_year) || published_year < 1000 || published_year > new Date().getFullYear())){
        return res.status(400).json({message: 'published_year must valid integer year'})
    }
    if(price && (typeof price !== 'number' || price <= 0)){
        return res.status(400).json({message: 'price must be a positive number'})
    }
    if(num_copies && (!Number.isInteger(num_copies) || num_copies < 0)){
        return res.status(400).json({message: 'num_copies must be a positive integer'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(auth && (!Number.isInteger(auth) || auth <= 0)){
        return res.status(400).json({message: 'auth must be a positive integer'})
    }
    if(category && (!Number.isInteger(category) || category <= 0)){
        return res.status(400).json({message: 'category must be a positive integer'})
    }
    next()
}