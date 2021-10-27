const {Account, User, Transaction} = require('../models')
const {generalHelper} = require('../helpers')

module.exports = {
    createAnAccountForUser: async (userId) => {
        const account = await Account.create({
            user: userId,
            total: 100000
        })

        await User.findByIdAndUpdate(userId, {
            account: account._id
        })
        return account
    },

    transfer: async (req, res, account, total, amount,) => {
        let toUser, toUserAccount, toUserAccountTotal, transaction
        toUser = await User.findOne({email: req.body.email}).populate('account')
        toUserAccount = toUser.account
        toUserAccountTotal = toUserAccount.total

        try {
            await account.updateOne({
                total: total - amount,
                updated_at: Date.now()
            })

            await toUserAccount.updateOne({
                total: toUserAccountTotal + amount,
                updated_at: Date.now()
            })

            transaction = await Transaction.create({
                from_user: req.user._id,
                to_user: toUser._id,
                amount: amount
            })

            req.user.account.total = total - amount
            console.log(req.user)
        } catch (error) {
            console.log(error)
            await resetTransaction(account, total, toUserAccount, toUserAccountTotal, transaction, res)
            return generalHelper.handleError(error, res)
        }
    }
}

const resetTransaction = async (account, total, toUserAccount, toUserAccountTotal,transaction, res) => {
    try {
        await account.updateOne({
            total
        })

        await toUserAccount.updateOne({
            total: toUserAccountTotal
        })

        if(transaction) {
            await transaction.delete()
        }
    } catch (error) {
        console.log('Resetting transaction failed')
        console.log(error)
        return generalHelper.handleError(error, res)
    }
}