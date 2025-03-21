const uploadFileService = require('../../services/upload_file');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const uploadFile = async (req, res) => {
    try {
        //const location = req.body.location ? JSON.parse(req.body.location) : null;
        let {location} = req.body;
        
        // Ensure location is properly parsed
        if (typeof location === 'string') {
            location = JSON.parse(location);
        }

        const response = await uploadFileService.uploadFile(req?.file, location);
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