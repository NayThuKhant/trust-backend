const responder = require('./responder')

module.exports = {
    handleError(error, res) {
        if(error.name && error.name === 'ValidationError') {
            responder.modelValidationResponse(error, res)
        } else {
            responder.internalServerProblemResponse(error, res)
        }
    }
}