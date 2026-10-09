import jwt from 'jsonwebtoken'

export function authorization(req, res, next){
    const authHeaders = req.headers.authorization

    if(!authHeaders){
        return res.status(401).json({message: 'No token provided'})
    }
    const token = authHeaders.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: 'Token expired, please log in again'})
        }
        return res.status(401).json({message: 'Invalid token'})
    }
}

export function requireAdmin(req, res, next){
    const role = req.user.role
    if(!role || role !== 'admin'){
        return res.status(401).json({message: 'Not allowed'})
    }
    next()
}

export function requireLibrarian(req, res, next){
    const role = req.user.role
    if(!role || role !== 'librarian'){
        return res.status(401).json({message: 'Not allowed'})
    }
    next()
}

export function requireStaff(req, res, next){
    const role = req.user.role
    if(!role || (role !== 'librarian' && role !== 'admin')){
        console.log(role)
        return res.status(401).json({message: 'Not allowed'})
    }
    next()
}