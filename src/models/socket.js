const mongoose = require('mongoose');

const socketSchema = mongoose.Schema({

    socket_id: {
        type: String,
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: { unique: true }
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
})

module.exports = mongoose.model('socket', socketSchema);