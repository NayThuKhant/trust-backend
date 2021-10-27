const {body} = require('express-validator')
const {User} = require("../models");

const validate = (method) => {
    switch (method) {
        case "register":
            return [
                body('username').isString(),
                body('email').isEmail(),
                body('password').isString()
            ]
        case "login":
            return [
                body('email').isEmail(),
                body('password').isString()
            ]
        case "receiver":
            const userErrorMessage = "User not found on the system"
            return [
                body('email')
                    .isEmail()
                    .custom(async (email) => {
                        try {
                            const user = await User.findOne({email})
                            if (!user) {
                                throw new Error(userErrorMessage)
                            }
                        } catch (error) {
                            throw new Error(userErrorMessage)
                        }
                        return true
                    }),
            ]
    }
}

module.exports = validate