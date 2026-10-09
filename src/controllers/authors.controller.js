import {getAuthor, getAllAuthors, getAllFilteredAuthors, createAuthors, putAuthor, patchAuthor, restoreAuthor, deleteAuthor} from '../services/authors.service.js'

export async function getAllAuth(req, res, next){
    try{

        const {nationality} = req.query

        if(nationality){
            const result = await getAllFilteredAuthors(nationality)
            return res.json(result)
        }

        const result = await getAllAuthors()
        return res.json(result)

    }
    catch(err){
        next(err)
    }
}

export async function getAuthorById(req, res, next){
    try{

        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: 'Id must be a positive number'})
        }
        const result = await getAuthor(id)

        if(result.status){
            return res.json(result.author)
        }
        return res.status(400).json({message: 'Author not found'})

    }
    catch(err){
        next(err)
    }
}

export async function createAuthor(req, res, next){
    try{
        const {name, bio, nationality} = req.body
        const result = await createAuthors(name, bio, nationality)
        if(result.status){
            return res.json({message: "New author successfully created", new_author: result.new_author})
        }
    }
    catch(err){
        next(err)
    }
}

export async function editAuthor(req, res, next){
    try{
        const {name, bio, nationality} = req.body
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: "Id must be a positive number"})
        }
        const result = await putAuthor(id, name, bio, nationality)
        if(result.status){
            return res.json({message: 'Author successfully updated', new_author: result.new_author})
        }
        return res.status(400).json({message: `Author with id ${id} does not exist`})
    }
    catch(err){
        next(err)
    }
}

export async function editPartiallyAuthor(req, res, next){
    try{
        let fields = []
        let values = []
        let index = 1
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: 'Id must be a positive number'})
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
        return res.status(400).json({message: `Author with id ${id} does not exist`})
    }
    catch(err){
        next(err)
    }
}

export async function restoreAuthors(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await restoreAuthor(id)
        if(result.status){
            return res.json({message: `Author with id ${id} successfully restored`, restored_author: result.restored_author})
        }
        if(result.reason == 'active'){
            return res.status(400).json({message: `Author with id ${id} already exists`})
        }
        if(result.reason == 'not found'){
            return res.status(400).json({message: `Author with id ${id} doesn't exists`})
        }
        return next(new Error(`Unhandled restoreAuthors reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function delAuthor(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: 'Id must be a positive number'})
        }
        const result = await deleteAuthor(id)
        if(result.status){
            return res.json({message: 'Author successfully deleted', deleted_author: result.deleted_author})
        }
        return res.status(400).json({message: `Author with id ${id} does not exist`})
    }
    catch(err){
        next(err)
    }
}