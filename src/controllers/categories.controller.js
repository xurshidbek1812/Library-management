import {getCategories, getCategoriesById, postCategories, putCategories, restoreCategories, deleteCategories} from '../services/categories.service.js'

export async function getAllCategories(req, res, next){
    try{
        const result = await getCategories()
        return res.json(result)
    }
    catch(err){
        next(err)
    }
}

export async function get_categoriesById(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await getCategoriesById(id)
        if(result.status){
            return res.json(result.category)
        }
        return res.status(400).json({message: "Category with this id doesn't exist"})
    }
    catch(err){
        next(err)
    }
}

export async function post_categories(req, res, next){
    try{
        const {name} = req.body
        const result = await postCategories(name)
        if(result.status){
            return res.status(201).json({message: "New category successfully created", new_category: result.category})
        }
        if(result.reason == 'exists')
            return res.status(409).json({message: `Category with name ${name} already exists`})
        if(result.reason == 'deleted')
            return res.status(409).json({message: `Category with name ${name} has been deleted. You can restore it`})

        return next(new Error(`Unhandled postCategories reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function put_categories(req, res, next){
    try{
        const {name} = req.body

        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await putCategories(id, name)
        if(result.status){
            return res.json({message: "Category successfully updated", updated_category: result.updated_category})
        }
        if(result.reason === 'not found')
            return res.status(400).json({message: "Category with this id doesn't exist"})
        if(result.reason === 'deleted')
            return res.status(409).json({message: "Category with this name has been deleted. You can restore it"})
        if(result.reason === 'exists')
            return res.status(409).json({message: "Category with this name already exist"})
    }
    catch(err){
        next(err)
    }
}

export async function restore_categories(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: `Id must be a positive integer`})
        }

        const result = await restoreCategories(id)
        if(result.status){
            return res.json({message: `Category successfully restored`, restored_category: result.restored_category})
        }

        if(result.reason == 'active'){
            return res.status(400).json({message: `Category with id ${id} already exists`})
        }
        if(result.reason == 'not found'){
            return res.status(400).json({message: `Category with id ${id} doesn't exists`})
        }
        if(result.reason == 'exists'){
            return res.status(400).json({message: `Category with id ${id} already exists`})
        }
        return next(new Error(`Unhandled restoreCategories reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function delCategories(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id <= 0){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await deleteCategories(id)
        if(result.status){
            return res.json({message: "Category successfully deleted", deleted_category: (await result).deleted_category})
        }
        return res.status(400).json({message: "Category with this id doesn't exist"})
    }
    catch(err){
        next(err)
    }
}