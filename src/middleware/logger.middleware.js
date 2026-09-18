export default function logger(req, res, next){
    console.log(`${req.method} request to ${req.url}`)
    next()
}