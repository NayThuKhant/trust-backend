const express = require('express')
const router = express.Router()
const {transactionController} = require('../controllers')

router.get('/transactions', async (req, res) => {
    return await transactionController.getTransactions(req, res)
})

module.exports = router