const UploadFile = require("../../models/upload_file");
const cloudinary = require('cloudinary').v2;
const fs = require("fs");

const uploadFile = async (file) => {
    try {
        if (!file) {
            throw new Error("No file uploaded");
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
        });

        const uploadedFile = new UploadFile({
            name: file.originalname,
            size: file.size,
            url: result.secure_url, 
        });

        const savedFile = await uploadedFile.save();

        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        return savedFile._id;
    } catch (error) {
        throw new Error(`File upload failed: ${error.message}`);
    }
};

module.exports = { uploadFile };
