module.exports = {
    jwtAuthMiddleware: require('./jwtAuth'),
    httpErrorHandler: require('./httpErrorHandler'),
    ensureXHRMiddleware: require('./ensureXHRRequest')
}