export function validateStaffSignUp(req, res, next){
    const {name, email, password, role} = req.body

    if(!name || typeof name != 'string' || name.length === 0){
        return res.status(400).json({message: 'Name must be a string with at least 1 charecter'})
    }
    if(!email || typeof email != 'string' || email.length === 0){
        return res.status(400).json({message: 'Email must be a string with at least 1 charecter'})
    }
    if(!password || typeof password != 'string' || password.length < 6){
        return res.status(400).json({message: 'Password must be a string with at least 6 charecter'})
    }
    if(!role || typeof role != 'string' || role !== 'librarian' && role !== 'admin'){
        return res.status(400).json({message: 'Role must be either librarian or admin'})
    }
    next()
}

export function validateStaffLogIn(req, res, next){
    const {email, password} = req.body
    if(!email || typeof email != 'string' || email.length === 0){
        return res.status(400).json({message: 'Email must be a string with at least 1 charecter'})
    }
    if(!password || typeof password != 'string' || password.length < 6){
        return res.status(400).json({message: 'Password must be a string with at least 6 charecter'})
    }
    next()
}