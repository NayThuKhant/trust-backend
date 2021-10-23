const responder = require('../helpers/responder')

module.exports = function () {
    return function (req, res, next) {
        if (req.xhr) {
            return next()
        }
        responder.ensureXHRResponse(res)
    }
}