export function validateCategoryName(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name} = req.body
    if(!name || typeof name !== 'string' || name.length === 0){
        return res.status(400).json({message: "Name must be a string"})
    }
    next()
}