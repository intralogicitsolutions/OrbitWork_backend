const uploadFileController = require('../../controllers/upload_file');
const { jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');
const upload = require('../../middleware/document_upload');

module.exports = (app) => {
    app.post(urlConstants.UPLOAD_FILE, jsonWebToken.validateToken, upload.single('files'), uploadFileController.uploadFile);
}