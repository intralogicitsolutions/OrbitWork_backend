// const multer = require('multer');
// const path = require('path');

// const MAX_FILE_SIZE = 5 * 1024 * 1024; 

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, '../uploads')); 
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + '-' + file.originalname);
//     }
//   });

// const upload = multer({
//       storage: storage,
//       limits: { fileSize: MAX_FILE_SIZE },
//     });

// module.exports = upload;


const multer = require('multer');
const path = require('path');

const MAX_SIZES = {
    image: 5 * 1024 * 1024,  // 5MB for images
    video: 50 * 1024 * 1024, // 50MB for videos
    audio: 10 * 1024 * 1024, // 10MB for audio
    document: 10 * 1024 * 1024, // 10MB for documents
};

// Allowed MIME types for different categories
const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    video: ['video/mp4', 'video/mpeg'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Define storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to check MIME types
const fileFilter = (req, file, cb) => {
    const fileType = req.body.fileType; // Get fileType from request body

    if (!fileType || !FILE_TYPES[fileType]) {
        return cb(new Error('Invalid or missing fileType parameter'), false);
    }

    if (!FILE_TYPES[fileType].includes(file.mimetype)) {
        return cb(new Error('File type not allowed'), false);
    }

    cb(null, true);
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: (req, file, cb) => {
        const fileType = req.body.fileType;
        return { fileSize: MAX_SIZES[fileType] || MAX_SIZES.document }; // Default to document size
    },
    fileFilter: fileFilter
});

// Middleware for handling location uploads (without file)
const handleLocationUpload = (req, res, next) => {
    const { fileType, latitude, longitude } = req.body;

    if (fileType === 'location') {
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and Longitude are required for location uploads" });
        }
        req.locationData = { latitude, longitude };
        return next(); // Move to the next middleware
    }

    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

module.exports = { upload, handleLocationUpload};
