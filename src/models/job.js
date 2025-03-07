const { number } = require('joi');
const mongoose = require('mongoose');
const { EstimatedTime, ProjectType } = require('../constants');

const jobSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
       ref: 'users'
    },

    title: {
        type: String,
        required: true
    },

    jobDescription: {
        type: String,
        required: true
    },
    
    location: {
        type: String,
        required: true
    },

    budget: {
        type: Number,
        required: true
    },

    isPaymentVerified: {
        type: Boolean,
        required: true
    },

    rating: {
        type: Number,
    },

    tags: {
        type: [String],
    },

    spending: { 
        type: Number, 
    },

    hourlyRateMin: {
        type: Number,
    },

    hourlyRateMax: {
        type: Number,
    },

    projectType: {
        type: String,
        enum: Object.values(ProjectType), 
    },

    estimatedTime: {
        type: String,
        enum: Object.values(EstimatedTime),
    },

    hoursPerWeek: {
        type: Number,
    },

    isFixedPrice: {
        type: Boolean,
    },

    document_id:{
        type: mongoose.Schema.Types.ObjectId,
    },

    proposals: {
        type: String,
        required: true
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

module.exports = mongoose.model('jobs', jobSchema);