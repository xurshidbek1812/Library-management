import jws from 'jsonwebtoken'

export function memberAuthorization(req, res, next){
    const AuthHeaders = req.headers.authorization
    if(!AuthHeaders){
        return res.status(401).json({message: "No token provided"})
    }
    const token = AuthHeaders.split(' ')[1]
    try{
        const decoded = jws.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        req.user = decoded
    }
    catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: 'Token expired, please log in again'})
        }
        return res.status(401).json({message: 'Invalid token'})
    }
    next()
}