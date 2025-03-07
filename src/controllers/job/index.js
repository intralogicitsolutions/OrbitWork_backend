const jobService = require('../../services/job');
const { getUserData } = require('../../middleware');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const createJob = async (req, res) => {
    try {
        const response = await jobService.createJob(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create job API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create job ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const getJob = async (req, res) => {
    try {
        const response = await jobService.getJob(req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get job API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get job ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const updateJob = async (req, res) => {
    try {
        const response = await jobService.updateJob(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} update job API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Update job ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const deleteJob = async (req, res) => {
    try {
        const response = await jobService.deleteJob(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} delete job API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Delete job ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    createJob,
    getJob,
    updateJob,
    deleteJob,
}