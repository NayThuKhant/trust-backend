require('./bootstrap/index')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const ensureXHRRequest = require('./middlewares/ensureXHRRequest')
const httpErrorHandler = require("./middlewares/httpErrorHandler")

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', ensureXHRRequest(), authRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})
// error handler
app.use(httpErrorHandler())

module.exports = app
