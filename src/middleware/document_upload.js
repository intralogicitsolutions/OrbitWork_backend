const multer = require('multer');
const path = require('path');

const MAX_FILE_SIZE_IMAGE_DOC_AUDIO = 5 * 1024 * 1024; 
const MAX_FILE_SIZE_VIDEO = 15 * 1024 * 1024; 

const allowedMimeTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    audio: ['audio/mpeg', 'audio/wav'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime']
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const { mimetype } = file;

    if (allowedMimeTypes.image.includes(mimetype)) {
        file.fileType = 'image';
        cb(null, true);
    } else if (allowedMimeTypes.document.includes(mimetype)) {
        file.fileType = 'document';
        cb(null, true);
    } else if (allowedMimeTypes.audio.includes(mimetype)) {
        file.fileType = 'audio';
        cb(null, true);
    } else if (allowedMimeTypes.video.includes(mimetype)) {
        file.fileType = 'video';
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, documents, audio, and videos are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: function (req, file, cb) {
            if (file.fileType === 'video') {
                cb(null, MAX_FILE_SIZE_VIDEO);
            } else {
                cb(null, MAX_FILE_SIZE_IMAGE_DOC_AUDIO ); 
            }
        }
    },
    fileFilter: fileFilter
});

module.exports = upload;
