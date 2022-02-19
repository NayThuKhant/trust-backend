const express = require('express')
const router = express.Router()
const {validationResult} = require('express-validator');
const {userValidator} = require('../../request-validators')
const {jwtAuthMiddleware} = require('../../middlewares')
const {apiControllers} = require('../../controllers')
const {authController} = apiControllers

router.post('/register', userValidator('register'), async (req, res) => {
    return await authController.register(req, res, validationResult(req))
})

router.post('/login', userValidator('login'), async (req, res) => {
    return await authController.login(req, res, validationResult(req))
})

router.get('/me', jwtAuthMiddleware(), async (req, res) => {
    return await authController.me(req, res)
})

router.post('/logout', jwtAuthMiddleware(), async (req, res) => {
    return await authController.logout(req, res)
})

module.exports = router
