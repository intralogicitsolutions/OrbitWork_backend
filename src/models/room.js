const { required } = require("joi");
const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "users", 
    },

    name: {
        type: String,
        required: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
    }],

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

module.exports = mongoose.model("room", RoomSchema);