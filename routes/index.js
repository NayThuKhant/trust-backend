module.exports = {
  apiRouters: {
    authRouter : require('./api/auth'),
    accountRouter : require('./api/account'),
    transactionRouter: require('./api/transaction'),
    userRouter: require('./api/user')
  }
}