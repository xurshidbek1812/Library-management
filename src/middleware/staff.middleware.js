import jwt from 'jsonwebtoken'

export function authorization(req, res, next){
    const authHeaders = req.headers.authorization

    if(!authHeaders){
        return res.status(400).json({message: 'No token provided'})
    }
    const token = authHeaders.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export function requireAdmin(req, res, next){
    const role = req.user.role
    if(!role || role !== 'admin'){
        return res.status(401).json({message: 'Not allowed'})
    }
    next()
}