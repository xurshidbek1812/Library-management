import pool from '../db.js'
import bcrypt from 'bcrypt'

export async function returnMembers(){
    const response = await pool.query('SELECT id, email, name, join_date FROM members WHERE status = true;')
    return response.rows
}

export async function returnFilteredMembers(fields, values){
    const response = await pool.query(`SELECT email, name, join_date FROM members WHERE ${fields} AND status = true;`, values)
    return response.rows
}

export async function returnMembersById(id){
    const response = await pool.query('SELECT id, name, email, join_date, status FROM members WHERE id = $1 AND status = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, member: response.rows[0]}
}

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
        const create = await pool.query('INSERT INTO members (name, email, password, join_date) values ($1, $2, $3, $4) RETURNING id;', [name, email, hashedPassword, join_date])
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

export async function updateMember(id, name, email, password, join_date){
    const exists = await pool.query('SELECT status FROM members WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'member not found'}
    }
    if(!exists.rows[0].status){
        return {status: false, reason: 'deleted'}
    }
    const email_exists = await pool.query('SELECT status FROM members WHERE email = $1;', [email])
    if(email_exists.rowCount > 0){
        if(email_exists.rows[0].status)
            return {status: false, reason: 'email exists'}
        return {status: false, reason: 'email deleted'}
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await pool.query('UPDATE members SET name = $1, email = $2, password = $3, join_date = $4 WHERE id = $5 AND status = true RETURNING id, email, name, join_date;', [name, email, hashedPassword, join_date, id])
    if(response.rowCount === 0){
        return {status: false, reason: "just deleted"}
    }
    return {status: true, updated_member: response.rows[0]}
}

export async function emailExists(email){
    const response = await pool.query('SELECT status FROM members WHERE email = $1;', [email])
    if(response.rowCount === 0){
        return {status: false}
    }
    if(response.rows[0].status){
        return {status: true, reason: 'exists'}
    }
    return {status: true, reason: 'deleted'}
}

export async function updatePartiallyMember(fields, values, index){
    const response = await pool.query(`UPDATE members SET ${fields} WHERE id = $${index} AND status = true RETURNING id, email, name, join_date;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_member: response.rows[0]}
}

export async function restoreMember(id){
    const exists = await pool.query('SELECT status FROM members WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    if(exists.rows[0].status){
        return {status: false, reason: 'exists'}
    }
    const response = await pool.query('UPDATE members SET status = true WHERE id = $1 AND status = false RETURNING id, email, name, join_date;', [id])
    if(response.rowCount === 0){
        return {status: false, reason: 'just restored'}
    }
    return {status: true, restored_member: response.rows[0]}
}

export async function removeMember(id){
    const response = await pool.query('UPDATE members SET status = false WHERE id = $1 AND status = true RETURNING email, name, join_date, status;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, deleted_member: response.rows[0]}
}