import bcrypt from 'bcrypt'
import pool from '../db.js'

export async function signup(name, email, password, role){
    const exists = await pool.query('SELECT id FROM staff WHERE email = $1', [email])
    if(exists.rowCount > 0){
        return {status: false}
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await pool.query('INSERT INTO staff (name, email, password, role) values ($1, $2, $3, $4) RETURNING id;', [name, email, hashedPassword, role])

    return {status: true, id: response.rows[0].id}
}

export async function login(email, password){
    const exists = await pool.query('SELECT * FROM staff WHERE email = $1', [email])
    if(exists.rowCount === 0){
        return {status: false}
    }
    const isMatch = await bcrypt.compare(password, exists.rows[0].password)
    if(isMatch){
        return {status: true, id: exists.rows[0].id, role: exists.rows[0].role}
    }
    return {status: false}
}