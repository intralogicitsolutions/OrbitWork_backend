const jobController = require('../../controllers/job');
const { jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.post(urlConstants.CREATE_JOB, jsonWebToken.validateToken, jobController.createJob);
    app.get(urlConstants.GET_JOB, jsonWebToken.validateToken, jobController.getJob);
    app.put(urlConstants.UPDATE_JOB, jsonWebToken.validateToken, jobController.updateJob);
    app.delete(urlConstants.DELETE_JOB, jsonWebToken.validateToken, jobController.deleteJob);
};