import pool from '../db.js'

export async function returnLoans(){
    const response = await pool.query('SELECT * FROM loans;')
    return response.rows
}

export async function returnLoansByMember(id){
    const response = await pool.query('SELECT * FROM loans WHERE member = $1;', [id])
    return response.rows
}

export async function returnFilteredLoans(fileds, values){
    const response = await pool.query(`SELECT * FROM loans WHERE ${fileds} AND is_active = true;`, values)
    return response.rows
}

export async function returnLoansById(id){
    const response = await pool.query('SELECT * FROM loans WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, loan: response.rows[0]}
}

export async function createLoan(member, book, borrowed_date, due_date){
    const member_exists = await pool.query('SELECT * FROM members WHERE id = $1 AND status = true;', [member])
    if(member_exists.rowCount === 0){
        return {status: false, reason: 'member'}
    }
    const num_copies = await pool.query('SELECT num_copies FROM books WHERE id = $1 AND is_active = true;', [book])
    if(num_copies.rowCount === 0){
        return {status: false, reason: "book"}
    }
    if(num_copies.rows[0].num_copies === 0){
        return {status: false, reason: "not enough"}
    }
    let response
    const client = await pool.connect()
    try{
        await client.query('BEGIN;')
        const bookUpdate = await client.query('UPDATE books SET num_copies = num_copies - 1 WHERE id = $1 AND num_copies > 0 AND is_active = true;', [book])
        if(bookUpdate.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: 'book update'}
        }
        response = await client.query('INSERT INTO loans (member, book, borrowed_date, due_date) VALUES ($1, $2, $3, $4) RETURNING *;', [member, book, borrowed_date, due_date])
        if(response.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: 'loan create'}
        }
        await client.query('COMMIT;')
    }
    catch(err){
        await client.query('ROLLBACK;')
        throw err
    }
    finally{
        client.release()
    }
    
    if(response.rowCount === 0){
        return {status: false, reason: 'error'}
    }
    return {status: true, new_loan: response.rows[0]}
}

export async function checkReturn_date(id){
    const result = await pool.query('SELECT return_date FROM loans WHERE id = $1 AND is_active = true;', [id])
    if(result.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    console.log(result.rows[0].return_date)
    if(result.rows[0].return_date === null){
        return {status: false, reason: 'null'}
    }
    return {status: true}
}

export async function editLoans(id, book, member, borrowed_date, due_date, return_date){
    const bookExists = await pool.query('SELECT is_active FROM books WHERE id = $1;', [book])
    if(bookExists.rowCount === 0 || !bookExists.rows[0].is_active){
        return {status: false, reason: 'no book'}
    }
    const memberExists = await pool.query('SELECT status FROM members WHERE id = $1;', [member])
    if(memberExists.rowCount === 0 || !memberExists.rows[0].status){
        return {status: false, reason: 'no member'}
    }
    const response = await pool.query('UPDATE loans SET book = $1, member = $2, borrowed_date = $3, due_date = $4, return_date = $5 WHERE id = $6 AND is_active = true RETURNING *;', [book, member, borrowed_date, due_date, return_date, id])
    if(response.rowCount === 0){
        return {status: false, reason: 'no loan'}
    }
    return {status: true, updated_loan: response.rows[0]}
}

export async function editPartilLoans(fields, values, index){
    const response = await pool.query(`UPDATE loans SET ${fields} WHERE id = $${index} AND is_active = true RETURNING *;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_loan: response.rows[0]}
}

export async function checkMember(id){
    const response = await pool.query('SELECT member FROM loans WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, member: response.rows[0].member}
}

export async function returnBooks(id, return_date){
    const exists = await pool.query('SELECT * FROM loans WHERE id = $1 AND return_date IS NULL AND is_active = true;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'loan not found'}
    }
    const client = await pool.connect()
    let response
    try{
        await client.query('BEGIN;')
        response = await client.query('UPDATE loans SET return_date = $1 WHERE id = $2 AND return_date IS NULL AND is_active = true RETURNING *;', [return_date, id])
        if(response.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: 'already closed'}
        }
        const book = await client.query('UPDATE books SET num_copies = num_copies + 1 WHERE id = $1 AND is_active = true;', [exists.rows[0].book])
        if(book.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: "book not found"}
        }
        await client.query('COMMIT;')
    }
    catch(err){
        await client.query('ROLLBACK;')
        throw err
    }
    finally{
        client.release()
    }
    return {status: true, closed_loan: response.rows[0]}
}

export async function undoReturnBooks(id){
    const client = await pool.connect()
    let response
    try{
        await client.query('BEGIN;')
        response = await client.query('UPDATE loans SET return_date = NULL WHERE id = $1 AND return_date IS NOT NULL AND is_active = true RETURNING *;', [id])
        if(response.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: 'loan not found'}
        }
        const book = await client.query('UPDATE books SET num_copies = num_copies - 1 WHERE id = $1 AND is_active = true;', [response.rows[0].book])
        if(book.rowCount === 0){
            await client.query('ROLLBACK;')
            return {status: false, reason: 'book not found'}
        }
        await client.query('COMMIT;')
    }
    catch(err){
        await client.query('ROLLBACK;')
        throw err
    }
    finally{
        client.release()
    }
    return {status: true, updated_loan: response.rows[0]}
}

export async function restoreLoan(id){
    const exists = await pool.query('SELECT is_active FROM loans WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    else if(exists.rows[0].is_active){
        return {status: false, reason: 'exists'}
    }
    const response = await pool.query('UPDATE loans SET is_active = true WHERE id = $1 AND is_active = false RETURNING *;', [id])
    if(response.rowCount === 0){
        return {status: false, reason: 'already restored'}
    }
    return {status: true, restored_loan: response.rows[0]}
}

export async function removeLoans(id){
    const response = await pool.query('UPDATE loans SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, deleted_loan: response.rows[0]}
}