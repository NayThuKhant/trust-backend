const {Account, User} = require('../models')

module.exports = {
    createAnAccountForUser : async (userId) => {
        const account = await Account.create({
            user: userId,
            total: 0
        })

        await User.findByIdAndUpdate(userId, {
            account: account._id
        })
        return account
    }
}