const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Date
    }
})

transactionSchema.virtual('active').get(function () {
    return !this.revoked_at
});

module.exports = mongoose.model('Transaction', transactionSchema)