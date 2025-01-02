const mongoose = require('mongoose');

const clientProfileSchema = mongoose.Schema({
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
    company: {
        name: {
            type: String,
            required: false
        },
        website: {
            type: String,
            required: false
        },
        industry: {
            type: String,
            required: false
        }
    },
    bio: {
        type: String,
        required: false
    },
    projects_posted: {
        type: Number,
        required: true,
        default: 0
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
    payment_details: {
        method: {
            type: String, // e.g., "Credit Card", "PayPal"
            required: false
        },
        account_info: {
            type: String,
            required: false // Mask or encrypt sensitive details
        }
    },
    preferences: {
        communication: {
            type: String, // e.g., "Email", "Phone"
            required: false
        },
        project_type: {
            type: String, // e.g., "Hourly", "Fixed Price"
            required: false
        }
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

module.exports = mongoose.model('client_profile', clientProfileSchema);
