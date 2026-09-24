import pool from '../db.js'

export async function getAllBooks(field = '', values = []){
    if(field == ''){
        const response = await pool.query('SELECT * FROM books WHERE is_active = true')
        return response.rows
    }
    const response = await pool.query(`SELECT * FROM books WHERE ${field} AND is_active = true;`, values)
    return response.rows
}

export async function getBooksById(id){
    const response = await pool.query('SELECT * FROM books WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, book: response.rows[0]}
}

export async function createBooks(isbn, title, published_year, price, num_copies, auth_id, category){
    const response = pool.query('INSERT INTO books (isbn, title, published_year, price, num_copies, auth, category) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [isbn, title, published_year, price, num_copies, auth_id, category])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, book: response.rows[0]}
}

export async function editBooks(id, isbn, title, published_year, price, num_copies, auth_id, category){
    const response = await pool.query('UPDATE books SET isbn = $1, title = $2, published_year = $3, price = $4, num_copies = $5 auth_id = $6, category = $7 WHERE id = $8 AND is_active = true RETURNING *;', [isbn, title, published_year, price, num_copies, auth_id, category, id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_book: response.rows[0]}
}

export async function editBooksPartially(fields, values, index){
    const response = pool.query(`UPDATE books SET ${fields} WHERE id = ${index} AND is_active = true RETURNING *;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_book: response.rows[0]}
}

export async function deleteBooks(id){
    const response = await pool.query('UPDATE books SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, deleted_book: response.rows[0]}
}