const {responder, generalHelper} = require('../helpers')
const {User} = require("../models");

module.exports = {
    receiver: async (req, res, validatedResult) => {
        const {body} = req
        if (req.user.email.toString() === body.email) {
            validatedResult.errors.push({
                value: body.email,
                msg: 'You cant transfer to yourself',
                param: 'email',
                location: 'body'
            })
        }

        if (!validatedResult.isEmpty()) {
            return await responder.initialValidateResponse(validatedResult, res)
        }

        try {
            let user = await User.findOne({email: body.email})
            const {_id, email, username} = user
            return responder.successResponse({_id, email, username}, res)
        } catch (error) {
            console.log(error)
            return generalHelper.handleError(error, res)
        }

    }
}