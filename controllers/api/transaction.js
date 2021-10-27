const {responder, generalHelper} = require('../../helpers')
const {Transaction} = require("../../models");

module.exports = {
    getTransactions: async (req, res) => {
        try {
            const userId = req.user._id
            const populatedFields = '_id email username'
            const transactions = await Transaction.where({$or: [{from_user: userId}, {to_user: userId}]})
                .populate('from_user', populatedFields)
                .populate('to_user', populatedFields)

            const formattedTransactions = transactions.map((transaction) => {
                let type;
                if (transaction.from_user._id.toString() === userId.toString()) {
                    type = 'paid'
                } else if (transaction.to_user._id.toString() === userId.toString()) {
                    type = 'received'
                }
                const {_id, from_user, to_user, created_at} = transaction
                transaction = {type, _id, from_user, to_user, created_at}
                return transaction
            })

            return await responder.successResponse(formattedTransactions, res)
        } catch (error) {
            return generalHelper.handleError(error, res)
        }
    }
}