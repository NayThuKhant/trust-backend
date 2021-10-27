module.exports = {
    apiControllers: {
        authController: require('./api/auth'),
        accountController: require('./api/account'),
        transactionController: require('./api/transaction'),
        userController: require('./api/user')
    }
}