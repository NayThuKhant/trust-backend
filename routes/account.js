const express = require('express')
const router = express.Router()
const {accountController} = require('../controllers')
const {accountValidator} = require('../request-validators')
const {validationResult} = require('express-validator');

router.get('/account-details', async (req, res) => {
    return await accountController.getAccountDetails(req, res)
})

router.post('/transfer', accountValidator('transfer'), async (req, res) => {
    return await accountController.transfer(req, res, validationResult(req))
})

module.exports = router