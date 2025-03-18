const mongoose = require("mongoose");

const UploadFileSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    size: { 
        type: Number, 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
    fileType: { 
        type: String, 
        enum: ["photo", "document", "audio", "video", "location"], // Allowed types
        required: true 
    },
    location: {  // Optional: Stores latitude & longitude for location uploads
        latitude: { type: Number },
        longitude: { type: Number }
    },
});

module.exports = mongoose.model('upload_files', UploadFileSchema);