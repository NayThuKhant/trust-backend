const express = require('express')
const router = express.Router()
const {userController} = require('../controllers')
const {userValidator} = require("../request-validators");
const {validationResult} = require("express-validator");

router.get('/receiver',userValidator('receiver'), async (req, res) => {
    return await userController.receiver(req, res, validationResult(req))
});

module.exports = router;
