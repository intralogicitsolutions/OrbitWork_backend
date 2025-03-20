const { required } = require("joi");
const mongoose = require("mongoose");
const GroupMessageSchema = new mongoose.Schema({

    sender_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },

    receiver_id: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true
    }],

    message: { 
        type: String, 
        required: true 
    },
    
    attechment_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "upload_files",
    },

    room_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "room",
    },

    message_type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'location'],
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

module.exports = mongoose.model("group_messages", GroupMessageSchema);