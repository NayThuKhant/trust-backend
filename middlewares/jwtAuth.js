const {getAuthenticatedUser} = require('../helpers/jwt')
const responder = require('../helpers/responder')

module.exports = function () {
    return async function (req, res, next) {
        let token = req.headers.authorization

        if (token) {
            const {user, jwt} = await getAuthenticatedUser(token)
            if (user && jwt) {
                req.user = user
                req.jwt = jwt
                return next()
            } else {
                return responder.unauthorizedResponse(res)
            }
        } else {
            return responder.unauthorizedResponse(res)
        }
    }
}