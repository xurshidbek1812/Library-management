import pool from '../db.js'

export async function getCategories(){
    const response = await pool.query('SELECT * FROM categories WHERE is_active = true;')
    return response.rows
}

export async function getCategoriesById(id){
    const response = await pool.query('SELECT * FROM categories WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, category: response.rows[0]}
}

export async function postCategories(name){
    const exists = await pool.query('SELECT * FROM categories WHERE name = $1;', [name])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'exists'}
        }
        return {status: false, reason: 'deleted'}
    }
    const response = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *;', [name])
    return {status: true, new_category: response.rows[0]}
}

export async function putCategories(id, name){
    const exists = await pool.query('SELECT is_active FROM categories WHERE name = $1;', [name])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'exists'}
        }
        return {status: false, reason: 'deleted'}
    }
    const response = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 AND is_active = true RETURNING *', [name, id])
    if(response.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    return {status: true, updated_category: response.rows[0]}
}

export async function restoreCategories(id){
    const exists = await pool.query('SELECT is_active FROM categories WHERE id = $1;', [id])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'exists'}
        }
        const restore = await pool.query('UPDATE categories SET is_active = true WHERE id = $1 AND is_active = false RETURNING *;', [id])
        return {status: true, restored_category: restore.rows[0]}
    }
    return {status: false, reason: 'not found'}
}

export async function deleteCategories(id){
    const response = await pool.query('UPDATE categories SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, deleted_category: response.rows[0]}
}