import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import {returnMembers, returnFilteredMembers, returnMembersById, updateMember, emailExists, updatePartiallyMember, restoreMember, removeMember, createMember, loginMember} from '../services/members.service.js'

export async function getMembers(req, res, next){
    try{
        const {join_date, name} = req.query
        let fields = []
        let values = []
        let index = 1
        if(name){
            fields.push(`name = $${name}`)
            values.push(name)
            index++
        }
        if(join_date){
            fields.push(`join_date = $${join_date}`)
            values.push(join_date)
            index++
        }

        if(fields.length === 0){
            const result = await returnMembers()
            return res.json(result)
        }
        const result = await returnFilteredMembers(fields.join(' AND '), values.push(id), index)
        return res.json(result)
    }
    catch(err){
        next(err)
    }
}

export async function getMembersById(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await returnMembersById(id)
        if(result.status){
            return res.json(result.member)
        }
        return res.status(400).json({message: `Member with id ${id} not found`})
    }
    catch(err){
        next(err)
    }
}

export async function signup(req, res, next){
    try{
        const {name, email, password, join_date} = req.body
        const result = await createMember(name, email, password, join_date)

        if(result.status){
            return res.status(201).json({message: "User successfully created", id: result.id})
        }
        return res.status(400).json({message: "User with this email already exists"})
    }
    catch(err){
        next(err)
    }
}

export async function login(req, res, next){
    try{
        const{email, password} = req.body

        const result = await loginMember(email, password)

        if(result.status){
            const token = jwt.sign({userId: result.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
            return res.json({token})
        }
        return res.status(401).json({message: "Invalid username or password"})

    }
    catch(err){
        next(err)
    }
}

export async function putMembers(req, res, next){
    try{
        const {name, email, password, join_date} = req.body
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }

        const result = await updateMember(id, name, email, password, join_date)

        if(result.status){
            return res.json({message: "Member successfully updated", updated_member: result.updated_member})
        }
        if(result.reason === 'member not found'){
            return res.status(400).json({message: `Member with id ${id} not found`})
        }
        if(result.reason === 'deleted'){
            return res.status(400).json({message: `Member with id ${id} has been deleted. You can restore it`})
        }
        if(result.reason === 'email exists'){
            return res.status(400).json({message: `Email ${email} already exists`})
        }
        if(result.reason === 'email deleted'){
            return res.status(400).json({message: `Member with email ${email} has been delete. You can restore it`})
        }
        if(result.reason === 'just deleted'){
            return res.status(400).json({message: `Somebody just deleted member with id ${id}`})
        }
        return next(new Error(`Unhandled putMember reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function patchMember(req, res, next){
    try{
        const {name, email, password, join_date} = req.body
        const id = Number(req.params.id)

        if(Number.isNaN(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }

        let fields = []
        let values = []
        let index = 1

        if(name){
            fields.push(`name = $${index}`)
            values.push(name)
            index++
        }
        if(email){
            const response = await emailExists(email)
            if(response.status){
                if(response.reason === 'exists'){
                    return res.status(409).json({message: `Member with email ${email} already exists`})
                }
                return res.status(409).json({message: `Member with email ${email} has been deleted. You can restore it`})
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
        if(join_date){
            fields.push(`join_date = $${index}`)
            values.push(join_date)
            index++
        }

        if(fields.length === 0){
            return res.status(400).json({message: "There is nothing to update"})
        }

        values.push(id)

        const result = await updatePartiallyMember(fields.join(', '), values, index)

        if(result.status){
            return res.json({message: "Member successfully updated", updated_member: result.updated_member})
        }

        return res.status(400).json({message: `Member with id ${id} not found`})

    }
    catch(err){
        next(err)
    }
}

export async function activateMember(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await restoreMember(id)
        if(result.status){
            return res.json({message: `Member successfully restored`, restored_member: result.restored_member})
        }
        if(result.reason === 'exists'){
            return res.status(400).json({message: `Member with id ${id} already exists`})
        }
        if(result.reason === 'not found'){
            return res.status(400).json({message: `Member with id ${id} doesn't exists`})
        }
        if(result.reason === 'just deleted'){
            return res.status(400).json({message: `Somebody just restored member with id ${id}`})
        }
        return next(new Error(`Unhandled activateMember reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function deleteMember(req, res, next){
    try{
        const id = Number(req.params.id)
        if(Number.isNaN(id) || id < 1){
            return res.status(400).json({message: "Id must be a positive integer"})
        }

        const result = await removeMember(id)
        if(result.status){
            return res.json({message: "Member successfully deleted", deleted_member: result.deleted_member})
        }

        return res.status(400).json({message: `Member with id ${id} not found`})
    }
    catch(err){
        next(err)
    }
}