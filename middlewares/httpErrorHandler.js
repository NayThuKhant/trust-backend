const {rawServerErrorResponse} = require("../helpers/responder");

module.exports = function () {
    return async function (err, req, res, next) {
        const message = err.message
        const error = req.app.get('env') === 'development' ? err : {}
        const statusCode = err.status || 500

        if (req.xhr) {
            rawServerErrorResponse(message, error.stack, statusCode, res)
        } else {
            res.locals.statusCode = statusCode
            res.locals.error = error
            res.locals.message = message
            res.locals.title = message
            res.status(statusCode)
            res.render('error')
        }
    }
}