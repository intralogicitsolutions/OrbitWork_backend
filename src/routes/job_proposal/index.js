const jobProposalController = require('../../controllers/job_proposal');
const { jsonWebToken, jobProfileValidator } = require('../../middleware');
const { urlConstants } = require('../../constants');
const upload = require('../../middleware/document_upload');

module.exports = (app) => {
    app.post(urlConstants.CREATE_JOB_PROPOSAL, jsonWebToken.validateToken, upload.array('files', 5), jobProposalController.createJobProposal);
    app.get(urlConstants.GET_JOB_PROPOSAL, jsonWebToken.validateToken, jobProposalController.getJobProposal);
    app.put(urlConstants.UPDATE_JOB_PROPOSAL, jsonWebToken.validateToken, upload.array('files', 5),jobProposalController.updateJobProposal);
    app.delete(urlConstants.DELETE_JOB_PROPOSAL, jsonWebToken.validateToken, jobProposalController.deleteJobProposal);
    app.get(urlConstants.GET_JOB_PROPOSAL_DETAIL, jsonWebToken.validateToken, jobProposalController.getJobProposalDetail);
};