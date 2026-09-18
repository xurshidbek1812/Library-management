import jwt from 'jsonwebtoken'

import {createMember, loginMember} from '../services/members.service.js'

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
        console.error(err)
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
        console.error(err)
        next(err)
    }
}