const {responder} = require('../../helpers')
const {jwtHelper, generalHelper, accountHelper} = require('../../helpers')
const {User} = require('../../models')
const bcrypt = require('bcrypt-nodejs')

module.exports = {
    register: async (req, res, validatedResult) => {
        if (!validatedResult.isEmpty()) {
            return responder.initialValidateResponse(validatedResult, res);
        }

        const {username, email, password} = req.body
        try {
            await bcrypt.genSalt(10, async (error, salt) => {
                if (error) {
                    return generalHelper.handleError(error, res)
                }

                await bcrypt.hash(password, salt, null, async (error, hash) => {
                    if (error) {
                        return generalHelper.handleError(error, res)
                    }

                    let user = await User.create({username, email, password: hash})
                    const account = await accountHelper.createAnAccountForUser(user._id)
                    user = JSON.parse(JSON.stringify(user))
                    user.token = await jwtHelper.generateTokenForUser(user._id)
                    user.account = account._id
                    return responder.successResponse(user, res, "Registered successfully")
                })
            })

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
            if (user) {
                await bcrypt.compare(password, user.password, async (error, isCorrectPassword) => {
                    if (!isCorrectPassword) {
                        return responder.unauthorizedResponse(res)
                    }
                    user = JSON.parse(JSON.stringify(user))
                    user.token = await jwtHelper.generateTokenForUser(user._id)
                    delete user.password
                    return responder.successResponse(user, res, "Logged In successfully")
                })
            } else {
                return responder.unauthorizedResponse(res)
            }
        } catch (error) {
            return generalHelper.handleError(error, res)
        }
    },

    me: async (req, res) => {
        try {
            return responder.successResponse(req.user, res)
        } catch (error) {
            return await generalHelper.handleError(error, res)
        }
    },

    logout: async (req, res) => {
        try {
            const logoutOfAllSessions = req.body.logout_of_all_sessions
            await jwtHelper.revoke(req, res, logoutOfAllSessions)
            return responder.successResponse(req.user, res, logoutOfAllSessions ? "Logged Out Of All Sessions successfully" : "Logout Out Successfully")
        } catch (error) {
            return generalHelper.handleError(error, res)
        }
    }
}
