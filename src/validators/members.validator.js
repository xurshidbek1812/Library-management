export function validateSignupMemberInfo(req, res, next){
    const {name, email, password} = req.body
    if(!name || typeof name !== 'string' || name.length < 1){
        return res.status(400).json({message: "Name must be a string"})
    }
    if(!email || typeof email !== 'string' || email.length < 1){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(!password || typeof password !== 'string' || password.length < 6){
        return res.status(400).json({message: "Password must be a string and it must contain at least 6 charecters"})
    }
    next()
}

export function validateLoginMemberInfo(req, res, next){
    const {email, password} = req.body
    if(!email || typeof email !== 'string' || email.length < 1){
        return res.status(400).json({message: "Email must be a string"})
    }
    if(!password || typeof password !== 'string' || password.length < 6){
        return res.status(400).json({message: "Password must be a string and it must contain at least 6 charecters"})
    }
    next()
}