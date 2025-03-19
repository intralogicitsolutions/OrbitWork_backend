const jobProposalService = require('../../services/job_proposal');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const createJobProposal = async (req, res) => {
    try {
        const response = await jobProposalService.createJobProposal(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create job proposal API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create job proposal ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const getJobProposal = async (req, res) => {
    try {
        const response = await jobProposalService.getJobProposal(req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get job proposal API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get job proposal ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    createJobProposal,
    getJobProposal,
}