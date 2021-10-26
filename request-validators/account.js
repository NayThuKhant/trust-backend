const {body} = require('express-validator')
const {User} = require('../models')

const validate = (method) => {
    switch (method) {
        case "transfer":
            const userErrorMessage = 'User not found on the system'
            return [
                body('user_id')
                    .isString()
                    .custom(async (userId) => {
                        try {
                            const user = await User.findById(userId)
                            if (!user) {
                                throw new Error(userErrorMessage)
                            }
                        } catch (error) {
                            throw new Error(userErrorMessage)
                        }
                        return true
                    }),
                body('amount')
                    .isNumeric()
                    .custom((amount) => {
                        if (amount <= 0) {
                            throw new Error('Transfer amount must be greater than 0')
                        }
                        return true
                    })
            ]

    }
}

module.exports = validate