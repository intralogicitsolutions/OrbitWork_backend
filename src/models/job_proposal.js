const { number } = require("joi");
const mongoose = require("mongoose");
const { EstimatedTime } = require('../constants');

const jobProposalSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },

    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'jobs'
    },

    amount: {
        type: Number,
        require: true
    },

    duration: {
        type: String,
        enum: Object.values(EstimatedTime),
    },

    cover_letter: {
        type: String,
        require: true,
    },

    attechment_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "upload_files",
        }
    ],

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
    deleted_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('job_proposals', jobProposalSchema);