const mongoose = require("mongoose");

const UploadFileSchema = mongoose.Schema({
    name: { 
        type: String, 
        unique: true 
        // required: true 
    },
    size: { 
        type: Number, 
        // required: true 
    },
    url: { 
        type: String, 
        unique: true
        // required: true 
    },
    fileType: { 
        type: String, 
        enum: ["image", "document", "audio", "video", "location"], 
      required: true 
    },
    location: { 
        latitude: { type: Number},
        longitude: { type: Number}
    },
});

module.exports = mongoose.model('upload_files', UploadFileSchema);