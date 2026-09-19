import pool from '../db.js'

export async function getAllBooks(category = '', author = ''){
    let category_id, author_id = -1
    if(category != ''){
        const id_res = await pool.query('SELECT id FROM categories WHERE name = $1', [category])
        category_id = id_res.rows[0].id
    }
    if(author != ''){
        const id_res = await pool.query('SELECT id FROM authors WHERE name = $1', [author])
        author_id = id_res.rows[0].id
    }

    if(category_id === -1 && author_id === -1){
        const response = await pool.query('SELECT * FROM books;')
        return response.rows
    }
    else if(category_id === -1){
        const response = await pool.query('SELECT * FROM books WHERE auth = $1;', [author_id])
        return response.rows
    }
    const response = await pool.query('SELECT * FROM books WHERE category = $1;', [category_id])
    return response.rows
}

export async function getBooksById(id){
    const response = await pool.query('SELECT * FROM books WHERE id = $1', [id])
    return response.rows[0]
}

export async function createBooks(isbn, title, published_year, price, num_copies, auth_id, category){

    const exists = await pool.query('SELECT * FROM books WHERE isbn = $1 or title = $2', [isbn, title])
    if(exists.rowCount > 0){
        return {status: false, reason: 'exists'}
    }

    const author = await pool.query('SELECT * FROM authors WHERE id = $1', [auth_id])
    if(author.rowCount === 0){
        return {status: false, reason: 'author'}
    }

    const response = pool.query('INSERT INTO books (isbn, title, published_year, price, num_copies, auth, category) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [isbn, title, published_year, price, num_copies, auth_id, category])
    return {status: true, book: response.rows[0]}
}