export default function errorHandler(err, req, res, next){
    if(err.code === '23505'){
        return res.status(409).json({message: 'This value already exists', constraint: err.constraint})
    }
    if(err.code === '23503'){
        return res.status(400).json({message: 'A referenced row does not exist', constraint: err.constraint})
    }
    if(err.code === '23514'){
        return res.status(400).json({message: 'A check rule was violated', constraint: err.constraint})
    }
    if(err.code === '23502'){
        return res.status(400).json({message: 'A required column is missing', column: err.column})
    }

    console.error(err)
    return res.status(500).json({message: "Something went wrong"})
}