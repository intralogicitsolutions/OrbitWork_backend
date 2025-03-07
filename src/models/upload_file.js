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
});

module.exports = mongoose.model('upload_files', UploadFileSchema);