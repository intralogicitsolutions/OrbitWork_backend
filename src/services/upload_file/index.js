const UploadFile = require("../../models/upload_file");
const cloudinary = require('cloudinary').v2;
const fs = require("fs");

const uploadFile = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file) {
                return reject(new Error("file must be provided."));
            }

            let existingFile, savedFile;

            if (file) {

                existingFile = await UploadFile.findOne({ name: file.originalname });

                if (existingFile) {
                    return resolve({
                        _id: existingFile._id,
                        name: existingFile.name,
                        size: existingFile.size,
                        url: existingFile.url,
                        fileType: existingFile.fileType
                    });
                }

                const fileExtension = file.mimetype.split("/")[0]; // Get "image", "video", "audio", etc.
                let fileType = "document";
                if (["image", "video", "audio"].includes(fileExtension)) {
                    fileType = fileExtension;
                }

                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: "auto",
                });

                savedFile = new UploadFile({
                    name: file.originalname,
                    size: file.size,
                    url: result.secure_url,
                    fileType: fileType 
                });

                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting local file:", err);
                });
            } 

          
            const savedData = await savedFile.save();
           // await savedFile.save();

            resolve({
                _id: savedData._id,
                name: savedData.name,
                size: savedData.size,
                url: savedData.url,
                fileType: savedData.fileType,
         
            });
        } catch (error) {
            reject(new Error(`File upload failed: ${error.message}`));
        }
    });
};

module.exports = { uploadFile };


