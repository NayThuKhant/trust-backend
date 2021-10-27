const express = require('express')
const router = express.Router()
const {userValidator} = require("../../request-validators");
const {validationResult} = require("express-validator");
const {apiControllers} = require('../../controllers')
const {userController} = apiControllers

router.get('/receiver',userValidator('receiver'), async (req, res) => {
    return await userController.receiver(req, res, validationResult(req))
});

module.exports = router;
