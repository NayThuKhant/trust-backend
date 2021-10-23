const {body} = require('express-validator')

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
    }
}

module.exports = validate