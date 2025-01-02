const mongoose = require('mongoose');

const freelancerProfileSchema = mongoose.Schema({
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
    professional_title: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    skills: {
        type: [String],
        required: false
    },
    experience_years: {
        type: Number,
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
        dribbble: {
            type: String,
            required: false
        },
        behance: {
            type: String,
            required: false
        },
        other: {
            type: [String],
            required: false
        }
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
    services_offered: {
        type: [String],
        required: false
    },
    availability: {
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Project-based'],
            required: false
        },
        timezone: {
            type: String,
            required: false
        }
    },
    languages_spoken: {
        type: [String],
        required: false
    },
    hourly_rate: {
        type: Number,
        required: false
    },
    previous_projects: {
        type: [
            {
                title: String,
                description: String,
                client: String,
                date: Date,
                url: String
            }
        ],
        required: false
    },
    payment_details: {
        method: {
            type: String,
            required: false
        },
        account_info: {
            type: String,
            required: false
        }
    },
    is_verified: {
        type: Boolean,
        required: false,
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

module.exports = mongoose.model('freelancer_profile', freelancerProfileSchema);
