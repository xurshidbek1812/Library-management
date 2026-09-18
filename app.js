import express from 'express'
import 'dotenv/config'

import errorHandler from './src/middleware/error.middleware.js'
import logger from './src/middleware/logger.middleware.js'

import memberRouter from './src/routes/members.routes.js'

const app = express()

app.use(express.json())
app.use(logger)



app.use('/members', memberRouter)

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is listening on port ' + port || 5000)
})