const responder = require('./responder')

module.exports = {
    handleError : async (error, res) => {
        if (error.name && error.name === 'ValidationError') {
            await responder.modelValidationResponse(error, res)
        } else {
            console.log(error)
            await responder.internalServerProblemResponse(error, res)
        }
    }
}