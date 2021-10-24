const mongoose = require('mongoose')


mongoose.connection
    .on('error', err => {
        console.log('Database Connection Failed')
        console.error(err);
    })
    .on('connected', () => {
        console.log(`Database connected`);
    })
    .on('disconnected', () => {
        console.log('Database Disconnected')
    })

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})