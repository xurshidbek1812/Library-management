import jwt from 'jsonwebtoken'
import {signup, login} from '../services/staff.service.js'

export async function StaffSignUp(req, res, next){
    try{

        const {name, email, password, role} = req.body
        const result = await signup(name, email, password, role)

        if(result.status){
            return res.status(201).json({message: 'User successfully created', id: result.id})
        }

        return res.status(409).json({message: 'User with this email already exists'})

    }
    catch(err){
        console.error(err)
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

        return res.status(401).json({message: 'Invalid email or password'})

    }
    catch(err){
        console.error(err)
        next(err)
    }
}