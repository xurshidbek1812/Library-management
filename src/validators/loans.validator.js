function isValidDate(value){
    if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)){
        return false
    }
    const d = new Date(value)
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export function validateFilterLoans(req, res, next){
    const {member, book, borrowed_date, due_date, return_date} = req.query

    if(member && (!Number.isInteger(Number(member)) || Number(member) < 1)){
        return res.status(400).json({message: "Member must be a positive integer"})
    }
    if(book && (!Number.isInteger(Number(book)) || Number(book) < 1)){
        return res.status(400).json({message: "Book must be a positive integer"})
    }
    if(borrowed_date && !isValidDate(borrowed_date)){
        return res.status(400).json({message: "Borrowed_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(due_date && !isValidDate(due_date)){
        return res.status(400).json({message: "Due_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(return_date && !isValidDate(return_date)){
        return res.status(400).json({message: "Return_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(borrowed_date && due_date){
        if(due_date < borrowed_date){
            return res.status(400).json({message: "due_date must be a later date than borrowed_date"})
        }
    }
    if(borrowed_date && return_date){
        if(return_date < borrowed_date){
            return res.status(400).json({message: "return_date must be a later date than borrowed_date"})
        }
    }
    next()
}

export function validatePostLoans(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "req.body is not provided"})
    }
    const {member, book, borrowed_date, due_date} = req.body

    if(!member || (!Number.isInteger(Number(member)) || Number(member) < 1)){
        return res.status(400).json({message: "Member must be a positive integer"})
    }
    if(!book || (!Number.isInteger(Number(book)) || Number(book) < 1)){
        return res.status(400).json({message: "Book must be a positive integer"})
    }
    if(!borrowed_date || !isValidDate(borrowed_date)){
        return res.status(400).json({message: "Borrowed_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(!due_date || !isValidDate(due_date)){
        return res.status(400).json({message: "Due_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(borrowed_date && due_date && due_date < borrowed_date){
        return res.status(400).json({message: "due_date must be a later date than borrowed_date"})
    }
    next()
}

export function validatePutLoans(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "req.body is not provided"})
    }
    const {member, book, borrowed_date, due_date, return_date} = req.body

    if(!member || (!Number.isInteger(Number(member)) || Number(member) < 1)){
        return res.status(400).json({message: "Member must be a positive integer"})
    }
    if(!book || (!Number.isInteger(Number(book)) || Number(book) < 1)){
        return res.status(400).json({message: "Book must be a positive integer"})
    }
    if(!borrowed_date || !isValidDate(borrowed_date)){
        return res.status(400).json({message: "Borrowed_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(!due_date || !isValidDate(due_date)){
        return res.status(400).json({message: "Due_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(!return_date || !isValidDate(return_date)){
        return res.status(400).json({message: "Return_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(borrowed_date && due_date && due_date < borrowed_date){
        return res.status(400).json({message: "due_date must be a later date than borrowed_date"})
    }
    if(borrowed_date && return_date && return_date < borrowed_date){
        return res.status(400).json({message: "return_date must be a later date than borrowed_date"})
    }
    next()
}

export function validatePatchLoans(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "req.body is not provided"})
    }
    const {member, book, borrowed_date, due_date, return_date} = req.body

    if(member && (!Number.isInteger(Number(member)) || Number(member) < 1)){
        return res.status(400).json({message: "Member must be a positive integer"})
    }
    if(book && (!Number.isInteger(Number(book)) || Number(book) < 1)){
        return res.status(400).json({message: "Book must be a positive integer"})
    }
    if(borrowed_date && !isValidDate(borrowed_date)){
        return res.status(400).json({message: "Borrowed_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(due_date && !isValidDate(due_date)){
        return res.status(400).json({message: "Due_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(return_date && !isValidDate(return_date)){
        return res.status(400).json({message: "Return_date must be a valid string date(YYYY-MM-DD)"})
    }
    if(borrowed_date && due_date){
        if(due_date < borrowed_date){
            return res.status(400).json({message: "due_date must be a later date than borrowed_date"})
        }
    }
    if(borrowed_date && return_date){
        if(return_date < borrowed_date){
            return res.status(400).json({message: "return_date must be a later date than borrowed_date"})
        }
    }
    next()
}