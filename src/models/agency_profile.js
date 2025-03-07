const mongoose = require('mongoose');

const agencyProfileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: { unique: true },
        ref: 'users'
    },
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
    phone: {
        type: String,
        required: false,
        unique: true
    },
    profile_picture: {
        type: String,
        required: false
    },
    agency_name: {
        type: String,
        required: true
    },
    agency_website: {
        type: String,
        required: false
    },
    agency_description: {
        type: String,
        required: false
    },
    team_size: {
        type: Number, // Number of employees or freelancers in the agency
        required: false
    },
    location: {
        city: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        }
    },
    industries_served: {
        type: [String], // e.g., ["IT", "Healthcare", "Finance"]
        required: false
    },
    services_offered: {
        type: [String], // e.g., ["Web Development", "Graphic Design"]
        required: false
    },
    certifications: {
        type: [
            {
                name: String,
                issuer: String,
                date: Date
            }
        ],
        required: false
    },
    portfolio: {
        website: {
            type: String,
            required: false
        },
        github: {
            type: String,
            required: false
        },
        other: {
            type: [String],
            required: false
        }
    },
    clients: {
        type: [
            {
                name: String,
                industry: String,
                project_description: String,
                date: Date
            }
        ],
        required: false
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: { unique: true },
        ref: 'freelancer_profiles'
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        required: true,
        default: 1
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
    }
});

module.exports = mongoose.model('agency_profile', agencyProfileSchema);
