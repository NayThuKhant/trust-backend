const express = require('express')
const router = express.Router()
const {apiControllers} = require('../../controllers')
const {transactionController} = apiControllers

router.get('/transactions', async (req, res) => {
    return await transactionController.getTransactions(req, res)
})

module.exports = router