const mongoose = require("mongoose");

const UploadFileSchema = mongoose.Schema({
    name: { 
        type: String, 
        unique: true,
        // required: true 
    },
    size: { 
        type: Number, 
        // required: true 
    },
    url: { 
        type: String, 
        default: null,
       unique: true,
        // required: true 
    },
    fileType: { 
        type: String, 
        enum: ["image", "document", "audio", "video", "location"], 
      required: true 
    },
});

module.exports = mongoose.model('upload_files', UploadFileSchema);