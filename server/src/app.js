const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const createHttpError = require('http-errors')

const { sequelize } = require('./models')

const jobsRouter = require('./routes/jobs/jobs.router')
const adminRouter = require('./routes/admin/admin.router')
const profilesRouter = require('./routes/profiles/profiles.router')
const balancesRouter = require('./routes/balances/balances.router')
const { HTTP_CODE_ERRORS } = require('./core/constants')

const app = express()

app.use(bodyParser.json())

app.use(
    cors({
        origin: 'http://localhost:3000',
    })
)

app.use(morgan('combine'))

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// routes
app.use('/jobs', jobsRouter)
app.use('/admin', adminRouter)
app.use('/profiles', profilesRouter)
app.use('/balances', balancesRouter)

// error handler
app.use((req, res, next) => {
    next(createHttpError(HTTP_CODE_ERRORS.NOT_FOUND))
})
app.use((err, req, res, next) => {
    res.status(err.status || HTTP_CODE_ERRORS.INTERNAL_SERVER_ERROR)
    res.json({
        error: {
            status: err.status || HTTP_CODE_ERRORS.INTERNAL_SERVER_ERROR,
            message: err.message,
        },
    })
})

// static FE web
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
