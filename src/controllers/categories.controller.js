import {getCategories, getCategoriesById, postCategories, putCategories, deleteCategories} from '../services/categories.service.js'

export async function getAllCategories(req, res, next){
    try{
        const result = await getCategories()
        return res.json(result)
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function get_categoriesById(req, res, next){
    try{
        const id = req.params.id
        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await getCategoriesById(id)
        if(result.status){
            return res.json(result.category)
        }
        return res.status(400).json({message: "Category with this id doesn't exist"})
    }
    catch(err){
        console.error(err)
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
        return res.status(409).json({message: "Category with this name already exists"})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function put_categories(req, res, next){
    try{
        const id = req.params.id
        const {name} = req.body

        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await putCategories(id, name)
        if(result.status){
            return res.json({message: "Category successfully updated", updated_category: result.updated_category})
        }
        return res.status(400).json({message: "Category with this id doesn't exist"})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}

export async function delCategories(req, res, next){
    try{
        const id = req.params.id
        if(Number.isNaN(Number(id))){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await deleteCategories(id)
        if(result.status){
            return res.json({message: "Category successfully deleted", deleted_category: (await result).deleted_category})
        }
        return res.status(400).json({message: "Category with this id doesn't exist"})
    }
    catch(err){
        console.error(err)
        next(err)
    }
}