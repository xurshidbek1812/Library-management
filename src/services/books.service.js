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
    const exists = await pool.query('SELECT * FROM books WHERE isbn = $1;', [isbn])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active == true){
            return {status: false, reason: 'exists'}
        }
        return {status: false, reason: 'deleted'}
    }
    const author = await pool.query('SELECT * FROM authors WHERE id = $1 AND is_active = true;', [auth_id])
    if(author.rowCount === 0){
        return {status: false, reason: 'author'}
    }
    const catg = await pool.query('SELECT * FROM categories WHERE id = $1 AND is_active = true;', [category])
    if(catg.rowCount === 0){
        return {status: false, reason: 'category'}
    }
    const response = await pool.query('INSERT INTO books (isbn, title, published_year, price, num_copies, auth, category) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [isbn, title, published_year, price, num_copies, auth_id, category])
    return {status: true, book: response.rows[0]}
}

export async function editBooks(id, isbn, title, published_year, price, num_copies, auth_id, category){
    const id_exists = await pool.query('SELECT is_active FROM books WHERE id = $1;', [id])
    if(id_exists.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    if(!id_exists.rows[0].is_active){
        return {status: false, reason: 'id deleted'}
    }
    const exists = await pool.query('SELECT * FROM books WHERE isbn = $1 AND id != $2;', [isbn, id])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'exists'}
        }
        return {status: false, reason: 'deleted'}
    }
    const author = await pool.query('SELECT * FROM authors WHERE id = $1 AND is_active = true;', [auth_id])
    if(author.rowCount === 0){
        return {status: false, reason: 'author'}
    }
    const catg = await pool.query('SELECT * FROM categories WHERE id = $1 AND is_active = true;', [category])
    if(catg.rowCount === 0){
        return {status: false, reason: 'category'}
    }
    const response = await pool.query('UPDATE books SET isbn = $1, title = $2, published_year = $3, price = $4, num_copies = $5, auth = $6, category = $7 WHERE id = $8 AND is_active = true RETURNING *;', [isbn, title, published_year, price, num_copies, auth_id, category, id])
    if(response.rowCount === 0){
        return {status: false, reason: 'just deleted'}
    }
    return {status: true, updated_book: response.rows[0]}
}

export async function checkIsbn(isbn){
    const response = await pool.query('SELECT is_active FROM books WHERE isbn = $1;', [isbn])
    if(response.rowCount === 0){
        return {status: false}
    }
    if(response.rows[0].is_active){
        return {status: true, reason: 'exists'}
    }
    return {status: true, reason: 'deleted'}
}

export async function checkAuthor(id){
    const exists = await pool.query('SELECT * FROM authors WHERE id = $1 AND is_active = true;', [id])
    if(exists.rowCount === 0){
        return false
    }
    return true
}

export async function checkCategory(id){
    const exists = await pool.query('SELECT * FROM categories WHERE id = $1 AND is_active = true;', [id])
    if(exists.rowCount === 0){
        return false
    }
    return true
}

export async function editBooksPartially(fields, values, index){
    const response = await pool.query(`UPDATE books SET ${fields} WHERE id = $${index} AND is_active = true RETURNING *;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_book: response.rows[0]}
}

export async function restoreBook(id){
    const exists = await pool.query('SELECT is_active FROM books WHERE id = $1;', [id])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'active'}
        }
        const restore = await pool.query('UPDATE books SET is_active = true WHERE id = $1 AND is_active = false RETURNING *;', [id])
        if(restore.rowCount === 0){
            return {status: false, reason: 'just restored'}
        }
        return {status: true, restored_book: restore.rows[0]}
    }
    return {status: false, reason: 'not found'}
}

export async function deleteBooks(id){
    const response = await pool.query('UPDATE books SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, deleted_book: response.rows[0]}
}