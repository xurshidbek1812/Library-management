import {returnLoans, returnLoansById, returnFilteredLoans, createLoan, checkReturn_date, editLoans, editPartilLoans, returnBooks, undoReturnBooks, restoreLoan, removeLoans} from '../services/loans.service.js'
import {returnMembersById} from '../services/members.service.js'
import {getBooksById} from '../services/books.service.js'


export async function getLoans(req, res, next){
    try{
        let fields = []
        let values = []
        let index = 1

        const {member, book, borrowed_date, due_date, return_date} = req.query

        if(member){
            fields.push(`member = $${index}`)
            values.push(member)
            index++
        }

        if(book){
            fields.push(`book = $${index}`)
            values.push(book)
            index++
        }

        if(borrowed_date){
            fields.push(`borrowed_date = $${index}`)
            values.push(borrowed_date)
            index++
        }

        if(due_date){
            fields.push(`due_date = $${index}`)
            values.push(due_date)
            index++
        }

        if(return_date){
            fields.push(`return_date = $${index}`)
            values.push(return_date)
            index++
        }

        if(fields.length === 0){
            const result = await returnLoans()
            return res.json(result)
        }
        const result = await returnFilteredLoans(fields.join(' AND '), values)
        return res.json(result)
    }
    catch(err){
        next(err)
    }
}

export async function getLoansById(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await returnLoansById(id)
        if(result.status){
            return res.json(result.loan)
        }
        return res.status(400).json({message: `Loan with id ${id} doesn't exist`})
    }
    catch(err){
        next(err)
    }
}

export async function postLoans(req, res, next){
    try{
        const {member, book, borrowed_date, due_date} = req.body
        const result = await createLoan(member, book, borrowed_date, due_date)

        if(result.status){
            return res.json({message: "New loan successfully created", new_loan: result.new_loan})
        }

        if(result.reason == 'book')
            return res.status(400).json({message: `Book with id ${book} doesn't exist`})
        if(result.reason == 'member')
            return res.status(400).json({message: `Member with id ${member} doesn't exist`})
        if(result.reason == 'not enough')
            return res.status(400).json({message: "Not enough number of copies"})
        if(result.reason === 'book update'){
            return res.status(500).json({message: "Could not decriment the book"})
        }
        if(result.reason === 'loan create'){
            return res.status(500).json({message: "Could not create a loan"})
        }
        if(result.reason == 'error'){
            return res.status(500).json({message: "Could not create new loan"})
        }

        return next(new Error(`Unhandled postLoans reason ${reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function putLoans(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be positive integer"})
        }
        const {member, book, borrowed_date, due_date, return_date} = req.body
        const check_return_date = await checkReturn_date(id)
        if(!check_return_date.status){
            if(check_return_date.reason === 'not found'){
                return res.status(400).json({message: `Loan with id ${id} doesn't exist`})
            }
            return res.status(400).json({message: `Loan with id ${id}s' return_date is NULL therefore you cannot edit this loan before closing it`})
        }
        const result = await editLoans(id, book, member, borrowed_date, due_date, return_date)
        if(result.status){
            return res.json({message: "Loan successfully upadated", updated_loan: result.updated_loan})
        }
        if(result.reason == 'no loan')
            return res.status(400).json({message: `Loan with id ${id} doesn't exist`})
        if(result.reason == 'no book')
            return res.status(400).json({message: `Book with id ${book} doesn't exist`})
        if(result.reason == 'no member')
            return res.status(400).json({message: `Member with id ${member} doesn't exist`})
        return next(new Error(`Unhandled putLoans reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function patchLoans(req, res, next){
    try{
        let fields = []
        let values = []
        let index = 1

        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be a number"})
        }
        const {member, book, borrowed_date, due_date, return_date} = req.body
        if(member){
            const exists = await returnMembersById(member)
            if(!exists.status){
                return res.status(400).json({message: `Member with id ${member} doesn't exist`})
            }
            fields.push(`member = $${index}`)
            values.push(member)
            index++
        }

        if(book){
            const exists = await getBooksById(book)
            if(!exists.status){
                return res.status(400).json({message: `Book with id ${book} doesn't exist`})
            }
            fields.push(`book = $${index}`)
            values.push(book)
            index++
        }

        if(borrowed_date){
            fields.push(`borrowed_date = $${index}`)
            values.push(borrowed_date)
            index++
        }

        if(due_date){
            fields.push(`due_date = $${index}`)
            values.push(due_date)
            index++
        }

        if(return_date){
            const check_return_date = await checkReturn_date(id)
            if(!check_return_date.status){
                if(check_return_date.reason === 'not found'){
                    return res.status(400).json({message: `Loan with id ${id} doesn't exist`})
                }
                return res.status(400).json({message: `Loan with id ${id}s' return_date is NULL therefore you cannot edit this loan before closing it`})
            }
            fields.push(`return_date = $${index}`)
            values.push(return_date)
            index++
        }

        if(fields.length === 0){
            return res.status(400).json({message: "Nothing is given to update"})
        }
        values.push(id)
        fields.join(', ')
        const result = await editPartilLoans(fields, values, index)

        if(result.status){
            return res.json({message: "Loan successfully updated", updated_loan: result.updated_loan})
        }
        return res.json({message: `Loan with id ${id} doesn't exist`})

    }
    catch(err){
        next(err)
    }
}

export async function closeLoans(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const {return_date} = req.body
        const result = await returnBooks(id, return_date)
        if(result.status){
            return res.json({message: `Loan successfully closed`, closed_loan: result.closed_loan})
        }

        if(result.reason == 'loan not found'){
            return res.status(400).json({message: `Loan with id ${id} not found`})
        }
        if(result.reason == 'book not found'){
            return res.status(400).json({message: `Borrowed book not found`})
        }
        if(result.reason == 'already closed'){
            return res.status(409).json({message: `Somebody just closed this loan`})
        }
    }
    catch(err){
        next(err)
    }
}

export async function undoCloseLoans(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id)){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await undoReturnBooks(id)
        if(result.status){
            return res.json({message: "Loan successfully updated", updated_loan: result.updated_loan})
        }

        if(result.reason === 'loan not found'){
            return res.status(400).json({message: `Loan not found`})
        }
        if(result.reason === 'book not found'){
            return res.status(400).json({message: `Book not found`})
        }
        return next(new Error(`Unhandled undoClosedLoans reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function restoreLoans(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be a positive integer"})
        }
        const result = await restoreLoan(id)
        if(result.status){
            return res.json({message: `Loan successfully restored`, restored_loan: result.restored_loan})
        }

        if(result.reason == 'not found'){
            return res.status(400).json({message: `Loan with id ${id} not found`})
        }
        if(result.reason == 'exists'){
            return res.status(409).json({message: `Loan with id ${id} already exists`})
        }
        if(result.reason == 'already restored'){
            return res.json({message: `Loan with id ${id} has been restored by someone else`})
        }
        return next(new Error(`Unhandled restoreLoans reason ${result.reason}`))
    }
    catch(err){
        next(err)
    }
}

export async function deleteLoans(req, res, next){
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({message: "Id must be a number"})
        }
        const result = await removeLoans(id)
        if(result.status){
            return res.json({message: "Loan successfully deleted", deleted_loan: result.deleted_loan})
        }
        return res.status(400).json({message: `Loan with id ${id} doesn't exist`})
    }
    catch(err){
        next(err)
    }
}