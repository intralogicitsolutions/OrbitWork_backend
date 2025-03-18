const jobController = require('../../controllers/job');
const { jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');
const {upload} = require('../../middleware/document_upload');

module.exports = (app) => {
    app.post(urlConstants.CREATE_JOB, jsonWebToken.validateToken, upload.single('files'), jobController.createJob);
    app.get(urlConstants.GET_JOB, jsonWebToken.validateToken, jobController.getJob);
    app.put(urlConstants.UPDATE_JOB, jsonWebToken.validateToken, upload.single('files'), jobController.updateJob);
    app.delete(urlConstants.DELETE_JOB, jsonWebToken.validateToken, jobController.deleteJob);
    app.get(urlConstants.GET_JOB_DETAIL, jsonWebToken.validateToken, jobController.getJobDetail);
};