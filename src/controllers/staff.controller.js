import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {returnStaff, returnFilteredStaff, returnStaffById, signup, login, editStaff, checkEmail, patchStuff, restoreStaff, removeStaff} from '../services/staff.service.js'

export async function getStaff(req, res, next){
    try{
        const {role} = req.query
        if(role){
            const result = await returnFilteredStaff(role)
            return res.json(result)
        }
        const result = await returnStaff()
        return res.json(result)
    }
    catch(err){
        next(err)
    }
}

export async function getStaffById(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await returnStaffById(id)
        if(result.status){
            return res.json(result.staff)
        }
        return res.status(400).json({message: `Staff with id ${id} doesn't exist`})
    }
    catch(err){
        next(err)
    }
}

export async function StaffSignUp(req, res, next){
    try{

        const {name, email, password, role} = req.body
        const result = await signup(name, email, password, role)

        if(result.status){
            return res.status(201).json({message: 'User successfully created', new_staff: result})
        }

        if(result.reason === 'exists'){
            return res.status(409).json({message: `User with email ${email} already exists`})
        }
        if(result.reason === 'exists'){
            return res.status(409).json({message: `User with email ${email} has been deleted. You can restore it`})
        }
        if(result.reason === 'just created'){
            return res.status(409).json({message: `User with email ${email} has just been created by someone else`})
        }

        return next(new Error(`Unhandled StaffSignUp reason ${result.reason}`))

    }
    catch(err){
        next(err)
    }
}

export async function StaffLogIn(req, res, next){
    try{

        const {email, password} = req.body
        const result = await login(email, password)

        if(result.status){
            const token = jwt.sign({userId: result.id, role: result.role}, process.env.JWT_SECRET, {expiresIn: '1h'})
            return res.json({token})
        }
        if(result.reason === 'no match')
            return res.status(401).json({message: 'Invalid email or password'})
        if(result.reason === 'deleted')
            return res.status(401).json({message: `Staff user with email ${email} has been deleted. You can restore it`})
        return next(new Error(`Unhandled StaffLogIn reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function StaffPut(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive number"})
        }
        const {name, email, password, role} = req.body
        const result = await editStaff(id, name, email, password, role)

        if(result.status){
            return res.json({message: 'Staff User successfully updated', updated_staff: result.updated_staff})
        }

        if(result.reason === 'id not found')
            return res.status(400).json({message: `Staff user with id ${id} doesn't exist`})
        if(result.reason === 'id deleted')
            return res.status(400).json({message: `Staff user with id ${id} has been deleted. You can restore it`})
        if(result.reason === 'email exists')
            return res.status(409).json({message: `Staff user with email ${email} exist`})
        if(result.reason === 'email deleted')
            return res.status(409).json({message: `Staff user with email ${email} has been deleted. You can restore it`})
        if(result.reason === 'just deleted')
            return res.status(400).json({message: `Staff user with id ${id} has just been deleted by someone`})
        return next(new Error(`Unhandled StaffPut reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function StaffPatch(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const {name, email, password, role} = req.body
        let fields = []
        let values = []
        let index = 1

        if(name){
            fields.push(`name = $${index}`)
            values.push(name)
            index++
        }
        if(email){
            const email_check = await checkEmail(email)
            if(email_check.status){
                if(email_check.reason === 'exists')
                    return res.status(409).json({message: `Staff user with email ${email} exists`})
                return res.status(409).json({message: `Staff user with email ${email} has been deleted. You can restore it`})
            }
            fields.push(`email = $${index}`)
            values.push(email)
            index++
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10)
            fields.push(`password = $${index}`)
            values.push(hashedPassword)
            index++
        }
        if(role){
            fields.push(`role = $${index}`)
            values.push(role)
            index++
        }
        if(fields.length === 0){
            return res.status(400).json({message: "Nothing is provided"})
        }
        values.push(id)
        const result = await patchStuff(fields.join(', '), values, index)
        if(result.status){
            return res.json({message: "Staff user successfully updated", updated_staff: result.updated_staff})
        }

        return res.status(400).json({message: `Staff user with id ${id} doesn't exist`})
    }
    catch(err){
        next(err)
    }
}

export async function restoreStaffUsers(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await restoreStaff(id)
        if(result.status){
            return res.json({message: `Staff user successfully restored`, restored_staff: result.restored_staff})
        }

        if(result.reason === 'not found'){
            return res.status(400).json({message: `Staff user with id ${id} doesn't exist`})
        }
        if(result.reason === 'exists'){
            return res.status(409).json({message: `Staff user with id ${id} exist`})
        }
        if(result.reason === 'just restored'){
            return res.status(400).json({message: `Staff user with id ${id} has just been restored by someone else`})
        }
        return next(new Error(`Unhandled restoreStaffUsers reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function deleteStaff(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await removeStaff(id)
        if(result.status){
            return res.json({message: `Staff user successfully deleted`, deleted_staff: result.deleted_staff})
        }

        if(result.reason === 'not found'){
            return res.status(400).json({message: `Staff user with id ${id} doesn't exist`})
        }
        if(result.reason === 'deleted'){
            return res.status(400).json({message: `Staff user with id ${id} has already been deleted`})
        }
        if(result.reason === 'just deleted'){
            return res.status(400).json({message: `Staff user with id ${id} has just been deleted by someone else`})
        }
        return next(new Error(`Unhandled deleteStuff reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}