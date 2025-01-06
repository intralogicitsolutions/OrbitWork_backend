const mongoose = require('mongoose');
const { UserTypes } = require('../constants');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [UserTypes.FREELANCER, UserTypes.CLIENT, UserTypes.AGENCY],
        required: true
    },
    token: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('users', userSchema);