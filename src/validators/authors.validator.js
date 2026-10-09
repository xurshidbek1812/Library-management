export function validateCreateAuthor(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, bio, nationality} = req.body
    if(!name || typeof name !== 'string' || name.length === 0){
        return res.status(400).json({message: 'Name must be a string'})
    }
    if(!bio || typeof bio !== 'string' || bio.length === 0){
        return res.status(400).json({message: 'Bio must be a string'})
    }
    if(!nationality || typeof nationality !== 'string' || nationality.length === 0){
        return res.status(400).json({message: 'Nationality must be a string'})
    }
    next()
}

export function validateEditAuthor(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, bio, nationality} = req.body
    if(!name || typeof name !== 'string' || name.length === 0){
        return res.status(400).json({message: 'New name must be a string'})
    }
    if(!bio || typeof bio !== 'string' || bio.length === 0){
        return res.status(400).json({message: 'Bio must be a string'})
    }
    if(!nationality || typeof nationality !== 'string' || nationality.length === 0){
        return res.status(400).json({message: 'Nationality must be a string'})
    }
    next()
}

export function validateEditPartiallyAuthor(req, res, next){
    if(!req.body){
        return res.status(400).json({message: "Nothing is provided"})
    }
    const {name, bio, nationality} = req.body
    if(name && (typeof name !== 'string' || name.length === 0)){
        return res.status(400).json({message: 'New name must be a string'})
    }
    if(bio && (typeof bio !== 'string' || bio.length === 0)){
        return res.status(400).json({message: 'Bio must be a string'})
    }
    if(nationality && (typeof nationality !== 'string' || nationality.length === 0)){
        return res.status(400).json({message: 'Nationality must be a string'})
    }
    next()
}