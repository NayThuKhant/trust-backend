const {responder} = require('../helpers')
const {jwtHelper, generalHelper} = require('../helpers')
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
            user = JSON.parse(JSON.stringify(user))
            user.token = await jwtHelper.generateTokenForUser(user._id)
            responder.successResponse(user, res, "Registered successfully")

        } catch (error) {
            generalHelper.handleError(error, res)
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
                responder.successResponse(user, res, "Logged In successfully")
            } else {
                responder.unauthorizedResponse(res)
            }
        } catch (error) {
            console.log(error)
            generalHelper.handleError()
        }
    },

    me: async (req, res) => {
        responder.successResponse(req.user, res)
    },

    logout: async (req, res) => {
        const logoutOfAllSessions = req.body.logout_of_all_sessions
        await jwtHelper.revoke(req, res, logoutOfAllSessions)
        responder.successResponse(req.user, res, logoutOfAllSessions ? "Logged Out Of All Sessions successfully" : "Logout Out Successfully")
    }
}