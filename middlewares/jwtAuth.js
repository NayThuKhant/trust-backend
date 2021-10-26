const {getAuthenticatedUser} = require('../helpers/jwt')
const responder = require('../helpers/responder')

module.exports = function () {
    return async function (req, res, next) {
        let token = req.headers.authorization

        if (token) {
            const {user, jwt, account} = await getAuthenticatedUser(token)
            if (user && jwt && account) {
                req.user = user
                req.jwt = jwt
                req.account = account
                return next()
            } else {
                return responder.unauthorizedResponse(res)
            }
        } else {
            return responder.unauthorizedResponse(res)
        }
    }
}