const express = require('express')
const router = express.Router()
const {validationResult, body} = require('express-validator');
const responder = require('../helpers/responder')
const User = require('../models/user')
const validate = require('../validators/user')
const {handleError} = require('../helpers/general')
const {generateTokenForUser, revoke} = require('../helpers/jwt')
const bcrypt = require('bcrypt')
const jwtAuth = require('../middlewares/jwtAuth')


router.post('/register', validate('register'), async (req, res) => {
    await register(req, res, validationResult(req));
})

router.post('/login', validate('login'), async (req, res) => {
    await login(req, res, validationResult(req));
})

router.get('/me', jwtAuth(), async (req, res) => {
    responder.successResponse(req.user, res)
})

router.post('/logout', jwtAuth(), async (req, res) => {
    await logout(req, res)
})


const register = async (req, res, validatedResult) => {
    responder.initialValidateResponse(validatedResult, res)

    const {username, email, password} = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        let user = await User.create({username, email, password: passwordHash})
        user = JSON.parse(JSON.stringify(user))
        user.token = await generateTokenForUser(user._id)
        responder.successResponse(user, res, "Registered successfully")

    } catch (error) {
        handleError(error, res)
    }
}

const login = async (req, res, validatedResult) => {
    responder.initialValidateResponse(validatedResult, res)

    const {email, password} = req.body
    try {
        let user = await User.findOne({email}).select('+password')
        if (user && await bcrypt.compare(password, user.password)) {
            user = JSON.parse(JSON.stringify(user))
            user.token = await generateTokenForUser(user._id)
            delete user.password
            responder.successResponse(user, res, "Logged In successfully")
        } else {
            responder.unauthorizedResponse(res)
        }
    } catch (error) {
        console.log(error)
        handleError()
    }
}

const logout = async (req, res) => {
    await revoke(req, res)
    responder.successResponse(req.user, res, "Logged Out successfully")
}


module.exports = router