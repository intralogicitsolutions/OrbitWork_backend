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

const updateJobProposal = async (req, res) => {
    try{
        const response = await jobProposalService.updateJobProposal(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} update job proposal API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Update job proposal ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const deleteJobProposal = async (req, res) => {
    try {
        const response = await jobProposalService.deleteJobProposal(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} delete job proposal API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Delete job proposal ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const getJobProposalDetail = async (req, res) => {
    try {
        const response = await jobProposalService.getJobProposalDetail(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get job proposal detail API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get job proposal detail ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    createJobProposal,
    getJobProposal,
    updateJobProposal,
    deleteJobProposal,
    getJobProposalDetail
}