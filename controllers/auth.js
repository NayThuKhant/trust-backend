const {responder} = require('../helpers')
const {jwtHelper, generalHelper, accountHelper} = require('../helpers')
const {User} = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
    register: async (req, res, validatedResult) => {
        if (!validatedResult.isEmpty()) {
            return responder.initialValidateResponse(validatedResult, res);
        }

        const {username, email, password} = req.body
        try {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            let user = await User.create({username, email, password: passwordHash})
            await accountHelper.createAnAccountForUser(user._id)
            user = JSON.parse(JSON.stringify(user))
            user.token = await jwtHelper.generateTokenForUser(user._id)
            return responder.successResponse(user, res, "Registered successfully")

        } catch (error) {
            return generalHelper.handleError(error, res)
        }
    },

    login: async (req, res, validatedResult) => {
        if (!validatedResult.isEmpty()) {
            return responder.initialValidateResponse(validatedResult, res);
        }

        const {email, password} = req.body
        try {
            let user = await User.findOne({email}).select('+password')
            if (user && await bcrypt.compare(password, user.password)) {
                user = JSON.parse(JSON.stringify(user))
                user.token = await jwtHelper.generateTokenForUser(user._id)
                delete user.password
                return responder.successResponse(user, res, "Logged In successfully")
            } else {
                return responder.unauthorizedResponse(res)
            }
        } catch (error) {
            console.log(error)
            return generalHelper.handleError()
        }
    },

    me: async (req, res) => {
        return responder.successResponse(req.user, res)
    },

    logout: async (req, res) => {
        const logoutOfAllSessions = req.body.logout_of_all_sessions
        await jwtHelper.revoke(req, res, logoutOfAllSessions)
        return responder.successResponse(req.user, res, logoutOfAllSessions ? "Logged Out Of All Sessions successfully" : "Logout Out Successfully")
    }
}