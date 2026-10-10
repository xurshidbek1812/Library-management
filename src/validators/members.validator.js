function isValidDate(value){
    if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)){
        return false
    }
    const d = new Date(value)
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export function validateFilterMember(req, res, next){
    const {name, join_date} = req.query

    if(name && (typeof name !== 'string' || name.length === 0)){
        return res.status(400).json({message: "Name must be a string"})
    }
    if(join_date && !isValidDate(join_date)){
        return res.status(400).json({message: "Join_date must be a valid string date(YYYY-MM-DD)"})
    }
    next()
}

export function validateSignupMemberInfo(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, email, password, join_date} = req.body
    if(!name || typeof name !== 'string' || name.length < 1){
        return res.status(400).json({message: "Name must be a string"})
    }
    if(!email || typeof email !== 'string' || email.length < 1){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(!password || typeof password !== 'string' || password.length < 6){
        return res.status(400).json({message: "Password must be a string and it must contain at least 6 charecters"})
    }
    if(join_date && !isValidDate(join_date)){
        return res.status(400).json({message: "join_date must be a valid string date(YYYY-MM-DD)"})
    }
    next()
}

export function validateLoginMemberInfo(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {email, password} = req.body
    if(!email || typeof email !== 'string' || email.length < 1){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(!password || typeof password !== 'string' || password.length < 6){
        return res.status(400).json({message: "Password must be a string and it must contain at least 6 charecters"})
    }
    next()
}

export function validatePutMember(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, email, password, join_date} = req.body

    if(!name || typeof name !== 'string' || name.length === 0){
        return res.status(400).json({message: "Name must be a string"})
    }
    if(!email || typeof email !== 'string' || email.length === 0){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(!password || typeof password !== 'string' || password.length < 6){
        return res.status(400).json({message: "Password must be a string with at least 6 charecters"})
    }
    if(!join_date || !isValidDate(join_date)){
        return res.status(400).json({message: "Join_date must be a valid string date(YYYY-MM-DD)"})
    }
    next()
}

export function validatePatchMember(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, email, password, join_date} = req.body

    if(name & (typeof name !== 'string' || name.length === 0)){
        return res.status(400).json({message: "Name must be a string"})
    }
    if(email && (typeof email !== 'string' || email.length === 0)){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(password && (typeof password !== 'string' || password.length < 6)){
        return res.status(400).json({message: "Password must be a string with at least 6 charecters"})
    }
    if(join_date && !isValidDate(join_date)){
        return res.status(400).json({message: "Join_date must be a valid string date(YYYY-MM-DD)"})
    }
    next()
}