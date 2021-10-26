const {responder} = require('../helpers')
const {Account} = require('../models')
const {generalHelper, accountHelper} = require('../helpers')

module.exports = {
    getAccountDetails: async (req, res) => {
        try {
            const account = await Account.findById(req.user.account)
            return responder.successResponse(account, res, "Success")
        } catch (error) {
            return generalHelper.handleError(error, res)
        }
    },

    transfer: async (req, res, validatedResult) => {

        const {account, body} = req
        const amount = body.amount
        const total = account.total

        if (req.user._id.toString() === body.user_id) {
            validatedResult.errors.push({
                value: body.user_id,
                msg: 'You cant transfer to yourself',
                param: 'user_id',
                location: 'body'
            })
        }

        if (amount > total) {
            validatedResult.errors.push({
                value: amount,
                msg: 'Transfer amount cannot exceed your total',
                param: 'amount',
                location: 'body'
            })
        }

        if (!validatedResult.isEmpty()) {
            return await responder.initialValidateResponse(validatedResult, res)
        }

        try{
            await accountHelper.transfer(req, res, account, total, amount)
            return await responder.successResponse(req.user, res)
        } catch (error) {
            console.log(error)
            return generalHelper.handleError(error, res)
        }
    }
}
