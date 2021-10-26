const mongoose = require('mongoose')

const jwtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    revoked_at: {
        type: Date,
        default: null
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

jwtSchema.virtual('active').get(function () {
    return !this.revoked_at
});

module.exports = mongoose.model('Jwt', jwtSchema)