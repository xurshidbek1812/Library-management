import {getAuthor, getAllAuthors, createAuthors, putAuthor, patchAuthor, deleteAuthor} from '../services/authors.service.js'

export async function getAllAuth(req, res, next){
    try{

        const response = await getAllAuthors()
        return res.json(response)

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function getAuthorById(req, res, next){
    try{

        const id = req.params.id
        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: 'The id must be a number'})
        }
        const result = await getAuthor(id)

        if(result.status){
            return res.json(result.author)
        }
        return res.status(400).json({message: 'Author not found'})

    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function createAuthor(req, res, next){
    try{
        const {name, bio, nationality} = req.body
        const result = await createAuthors(name, bio, nationality)

        res.status(201).json({message: 'Author successfully created', new_author: result})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function editAuthor(req, res, next){
    try{
        const {name, bio, nationality} = req.body
        const id = req.params.id
        const result = await putAuthor(id, name, bio, nationality)
        if(result.status){
            return res.json({message: 'Author successfully updated', new_author: result.new_author})
        }
        return res.status(400).json({message: 'Author with this name does not exist'})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function editPartiallyAuthor(req, res, next){
    try{
        let fields = []
        let values = []
        let index = 1
        const id = req.params.id
        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: 'Id must be a number'})
        }

        if(req.body.name){
            fields.push(`name = $${index}`)
            values.push(req.body.name)
            index++
        }
        if(req.body.bio){
            fields.push(`bio = $${index}`)
            values.push(req.body.bio)
            index++
        }
        if(req.body.nationality){
            fields.push(`nationality = $${index}`)
            values.push(req.body.nationality)
            index++
        }
        if(fields.length === 0){
            return res.status(400).json({message: 'Nothing is provided to update'})
        }
        values.push(id)
        const result = await patchAuthor(fields.join(', '), values, index)
        if(result.status){
            return res.json({message: 'Author successfully updated', updated_author: result.author})
        }
        return res.status(400).json({message: 'Author with this name does not exist'})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function delAuthor(req, res, next){
    try{
        const id = req.params.id
        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: 'Id must be a number'})
        }
        const result = await deleteAuthor(id)
        if(result.status){
            return res.json({message: 'Author successfully deleted', deleted_author: result.deleted_author})
        }
        return res.status(400).json({message: 'Author with this id does not exist'})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}