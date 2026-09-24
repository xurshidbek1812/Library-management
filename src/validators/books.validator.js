export function validateBooks(req, res, next){
    const {isbn, title, published_year, price, num_copies, auth, category} = req.body

    if(!isbn || typeof isbn !== 'string' || isbn.length > 20 || isbn.length < 13){
        return res.status(400).json({message: 'isbn must be string containing 13-20 charecters'})
    }
    if(!title || typeof title !== 'string' || title.length === 0){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(!published_year || typeof published_year !== 'string' || published_year.length < 5){
        return res.status(400).json({message: 'published_year must be a string with at least 5 charecters'})
    }
    if(!price || typeof price !== 'number' || price <= 0){
        return res.status(400).json({message: 'price must be a positive number'})
    }
    if(!num_copies || typeof num_copies !== 'number' || num_copies < 0){
        return res.status(400).json({message: 'num_copies must be a positive integer'})
    }
    if(!title || typeof title !== 'string' || title.length === 0){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(!auth || typeof auth !== 'number' || auth <= 0){
        return res.status(400).json({message: 'auth must be a positive integer'})
    }
    if(!category || typeof category !== 'number' || category <= 0){
        return res.status(400).json({message: 'category must be a positive integer'})
    }
    next()
}

export function validatePatchBooks(req, res, next){
    const {isbn, title, published_year, price, num_copies, auth, category} = req.body

    if(isbn && (typeof isbn !== 'string' || isbn.length > 20 || isbn.length < 13)){
        return res.status(400).json({message: 'isbn must be string containing 13-20 charecters'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(published_year && (typeof published_year !== 'string' || published_year.length < 5)){
        return res.status(400).json({message: 'published_year must be a string with at least 5 charecters'})
    }
    if(price && (typeof price !== 'number' || price <= 0)){
        return res.status(400).json({message: 'price must be a positive number'})
    }
    if(num_copies && (typeof num_copies !== 'number' || num_copies < 0)){
        return res.status(400).json({message: 'num_copies must be a positive integer'})
    }
    if(title && (typeof title !== 'string' || title.length === 0)){
        return res.status(400).json({message: 'title must be a string'})
    }
    if(auth && (typeof auth !== 'number' || auth <= 0)){
        return res.status(400).json({message: 'auth must be a positive integer'})
    }
    if(category && (typeof category !== 'number' || category <= 0)){
        return res.status(400).json({message: 'category must be a positive integer'})
    }
    next()
}