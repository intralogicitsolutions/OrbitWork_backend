// const UploadFile = require("../../models/upload_file");
// const cloudinary = require('cloudinary').v2;
// const fs = require("fs");

// const uploadFile = async (file, fileType, latitude = null, longitude = null) => {
//     return new Promise(async (resolve, reject)=> {
//         try {
//             if (!file) {
//                 //throw new Error("No file uploaded");
//                 reject(new Error("No file uploaded"));
//                 return;
//             }
    
//             const result = await cloudinary.uploader.upload(file.path, {
//                 resource_type: "auto",
//             });
    
//             const uploadedFile = new UploadFile({
//                 name: file.originalname,
//                 size: file.size,
//                 url: result.secure_url, 
//             });
    
//             const savedFile = await uploadedFile.save();
    
//             fs.unlink(file.path, (err) => {
//                 if (err) console.error("Error deleting local file:", err);
//             });
    
//            // return (savedFile._id);
//            resolve({
//             _id: savedFile._id,
//             name: savedFile.name,
//             size: savedFile.size,
//             url: savedFile.url
//         }); 
//         } catch (error) {
//             throw new Error(`File upload failed: ${error.message}`);
//         }
//     });
// };

// module.exports = { uploadFile };
const UploadFile = require("../../models/upload_file");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadFile = async (file, fileType, latitude = null, longitude = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file && fileType !== "location") {
                reject(new Error("No file uploaded"));
                return;
            }

            let uploadResult = null;
            let fileUrl = null;

            // Determine resource type for Cloudinary upload
            let resourceType = "auto"; // Default for Cloudinary auto-detection
            if (fileType === "photo") resourceType = "image";
            if (fileType === "audio") resourceType = "video"; // Cloudinary handles audio under "video"
            if (fileType === "video") resourceType = "video";
            if (fileType === "document") resourceType = "raw"; // "raw" is used for PDFs, docs, etc.

            if (file) {
                // Upload file to Cloudinary
                uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: resourceType });
                fileUrl = uploadResult.secure_url;
            }

            // Create an entry for the uploaded file
            const uploadedFile = new UploadFile({
                name: file ? file.originalname : "Location Data",
                size: file ? file.size : 0,
                url: fileUrl || `geo:${latitude},${longitude}`,
                fileType,
                location: fileType === "location" ? { latitude, longitude } : undefined
            });

            const savedFile = await uploadedFile.save();

            // Remove file from local storage after upload
            if (file) {
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting local file:", err);
                });
            }

            resolve({
                _id: savedFile._id,
                name: savedFile.name,
                size: savedFile.size,
                url: savedFile.url,
                fileType: savedFile.fileType,
                location: savedFile.location
            });
        } catch (error) {
            reject(new Error(`File upload failed: ${error.message}`));
        }
    });
};

module.exports = { uploadFile };
