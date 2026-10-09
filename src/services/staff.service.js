import bcrypt from 'bcrypt'
import pool from '../db.js'

export async function returnStaff(){
    const response = await pool.query('SELECT id, name, email, role FROM staff WHERE is_active = true;')
    return response.rows
}

export async function returnFilteredStaff(role){
    const response = await pool.query('SELECT id, name, email, role FROM staff WHERE role = $1 AND is_active = true;', [role])
    return response.rows
}

export async function returnStaffById(id){
    const response = await pool.query('SELECT id, name, email, role FROM staff WHERE id = $1 AND is_active = true;', [id])
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, staff: response.rows[0]}
}

export async function signup(name, email, password, role){
    const exists = await pool.query('SELECT is_active FROM staff WHERE email = $1', [email])
    if(exists.rowCount > 0){
        if(exists.rows[0].is_active){
            return {status: false, reason: 'exists'}
        }
        return {status: false, reason: 'deleted'}
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await pool.query('INSERT INTO staff (name, email, password, role) values ($1, $2, $3, $4) RETURNING id, name, email, role;', [name, email, hashedPassword, role])

    if(response.rowCount === 0){
        return {status: false, reason: 'just created'}
    }
    return {status: true, new_staff: response.rows[0]}
}

export async function login(email, password){
    const exists = await pool.query('SELECT * FROM staff WHERE email = $1', [email])
    if(exists.rowCount === 0){
        return {status: false, reason: 'no match'}
    }
    if(exists.rowCount > 0 && !exists.rows[0].is_active){
        return {status: false, reason: 'deleted'}
    }
    const isMatch = await bcrypt.compare(password, exists.rows[0].password)
    if(isMatch){
        return {status: true, id: exists.rows[0].id, role: exists.rows[0].role}
    }
    return {status: false, reason: 'no match'}
}

export async function editStaff(id, name, email, password, role){
    const exists = await pool.query('SELECT is_active FROM staff WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'id not found'}
    }
    if(!exists.rows[0].is_active){
        return {status: false, reason: 'id deleted'}
    }
    const email_check = await pool.query('SELECT is_active FROM staff WHERE email = $1;', [email])
    if(email_check.rowCount > 0){
        if(!email_check.rows[0].is_active){
            return {status: false, reason: 'email deleted'}
        }
        return {status: false, reason: 'email exists'}   
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await pool.query('UPDATE staff SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 AND is_active = true RETURNING id, name, email, role;', [name, email, hashedPassword, role, id])
    if(response.rowCount === 0){
        return {status: false, reason: 'just deleted'}
    }
    return {status: true, updated_staff: response.rows[0]}
}

export async function checkEmail(email){
    const exists = await pool.query('SELECT is_active FROM staff WHERE email = $1;', [email])
    if(exists.rowCount === 0){
        return {status: false}
    }
    if(exists.rows[0].is_active)
        return {status: true, reason: 'exists'}
    return {status: true, reason: 'deleted'}
}

export async function patchStuff(fields, values, index){
    const response = await pool.query(`UPDATE staff SET ${fields} WHERE id = $${index} AND is_active = true RETURNING id, name, email, role;`, values)
    if(response.rowCount === 0){
        return {status: false}
    }
    return {status: true, updated_staff: response.rows[0]}
}

export async function restoreStaff(id){
    const exists = await pool.query('SELECT is_active FROM staff WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    if(exists.rows[0].is_active){
        return {status: false, reason: 'exists'}
    }
    const response = await pool.query('UPDATE staff SET is_active = true WHERE id = $1 AND is_active = false RETURNING id, name, email, role;', [id])
    if(response.rowCount === 0){
        return {status: false, reason: 'just restored'}
    }
    return {status: true, restored_staff: response.rows[0]}
}

export async function removeStaff(id){
    const exists = await pool.query('SELECT is_active FROM staff WHERE id = $1;', [id])
    if(exists.rowCount === 0){
        return {status: false, reason: 'not found'}
    }
    if(!exists.rows[0].is_active){
        return {status: false, reason: 'deleted'}
    }
    const response = await pool.query('UPDATE staff SET is_active = false WHERE id = $1 AND is_active = true RETURNING id, name, email, role;', [id])
    if(response.rowCount === 0){
        return {status: false, reason: 'just deleted'}
    }
    return {status: true, deleted_staff: response.rows[0]}
}