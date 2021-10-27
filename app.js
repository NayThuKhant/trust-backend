require('./bootstrap/index')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const {ensureXHRMiddleware, jwtAuthMiddleware} = require('./middlewares')
const httpErrorHandler = require("./middlewares/httpErrorHandler")
const apiRouters = require('./routes')

const app = express()
//view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//dependencies
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//routes
const publicApiRouters = ['authRouter']
const publicRouterMiddlewares = [ensureXHRMiddleware()]
const protectedRouterMiddlewares = [ensureXHRMiddleware(), jwtAuthMiddleware()]

const dirtyApiRoutePrefix = '/' + process.env.API_PREFIX
const apiRoutePrefix = dirtyApiRoutePrefix.replace('//', '/')

Object.entries(apiRouters).forEach(([key, router]) => {
    if (publicApiRouters.includes(key)) {
        app.use(apiRoutePrefix, publicRouterMiddlewares, router)
    }else {
        app.use(apiRoutePrefix, protectedRouterMiddlewares, router)
    }
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})
// error handler
app.use(httpErrorHandler())

module.exports = app
