import pool from '../db.js'
import bcrypt from 'bcrypt'

export async function createMember(name, email, password, join_date = ''){
    const exists = await pool.query('SELECT * FROM members WHERE email = $1;', [email])
    if(exists.rowCount > 0){
        return {status: false}
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    if(join_date == ''){
        const create = await pool.query('INSERT INTO members (name, email, password) values ($1, $2, $3) RETURNING id;', [name, email, hashedPassword])
        return {status: true, id: create.rows[0].id}
    }
    else{
        const create = await pool.query('INSERT INTO members (name, email, password, join_date) values ($1, $2, $3) RETURNING id;', [name, email, hashedPassword, join_date])
        return {status: true, id: create.rows[0].id}
    }
}

export async function loginMember(email, password){
    const result = await pool.query('SELECT * FROM members WHERE email = $1;', [email])
    if(result.rows.length > 0){
        const isMatch = await bcrypt.compare(password, result.rows[0].password)
        if(isMatch){
            return {status: true, id: result.rows[0].id}
        }
        return {status: false}
    }
    return {status: false}
}