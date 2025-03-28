const uploadFileService = require('../../services/upload_file');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const uploadFile = async (req, res) => {
    try {
        const response = await uploadFileService.uploadFile(req?.file);
        logger.info(`${messageConstants.RESPONSE_FROM} upload file API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Upload File ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    uploadFile,
}