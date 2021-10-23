const jwt = require('jsonwebtoken')
const Jwt = require('../models/jwt')
const {handleError} = require('../helpers/general')

async function generateTokenForUser(userId) {
    const personalAccessToken = await Jwt.create({
        user: userId
    })

    return jwt.sign({sub: 'Personal Access Token', user_id: userId, jwtid: personalAccessToken._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_TTL})
}

async function getAuthenticatedUser(token) {
    let jwtToken = token.replace('Bearer ', '')
    try {
        const payload = await jwt.verify(jwtToken, process.env.JWT_SECRET)
        const jwtRecord = await Jwt.findById(payload.jwtid).populate('user')
        if (jwtRecord.active) {
            return {
                user : jwtRecord.user,
                jwt : jwtRecord
            }
        }
        return {user: null, jwt: null}
    } catch (error) {
        return {user: null, jwt: null}
    }
}

async function revoke(req, res) {
    try{
        await Jwt.findOneAndUpdate({'_id': req.jwt._id}, {'revoked_at': Date.now()})
    } catch (error) {
        handleError(error, res)
    }
}

module.exports = {
    generateTokenForUser,
    getAuthenticatedUser,
    revoke
}

