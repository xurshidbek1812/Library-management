import pool from '../db.js'

export async function getAllAuthors(){
    const response = await pool.query('SELECT * FROM authors WHERE is_active = true;')
    return response.rows
}

export async function getAuthor(id){
    const response = await pool.query('SELECT * FROM authors WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, author: response.rows[0]}
}

export async function createAuthors(name, bio, nationality){
    const response = await pool.query('INSERT INTO authors (name, bio, nationality) values ($1, $2, $3) RETURNING *;', [name, bio, nationality])
    return response.rows[0]
}

export async function putAuthor(id, name, bio, nationality){
    const response = await pool.query('UPDATE authors SET name = $1, bio = $2, nationality = $3 WHERE id = $4 AND is_active = true RETURNING *;', [name, bio, nationality, id])
    if(response.rowCount > 0)
        return {status: true, new_author: response.rows[0]}
    return {status: false}
}

export async function patchAuthor(fields, values, index){
    const response = await pool.query(`UPDATE authors SET ${fields} WHERE id = $${index} AND is_active = true RETURNING *;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, author: response.rows[0]}
}

export async function deleteAuthor(id){
    const response = await pool.query('SELECT * FROM authors WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    const softDelete = await pool.query('UPDATE authors SET is_active = false WHERE id = $1 RETURNING *;', [id])
    return {status: true, deleted_author: softDelete.rows[0]}
}