const profileService = require('../../services/profile');
const { logger } = require('../../utils');
const { messageConstants } = require('../../constants');

const createFreelancerProfile = async (req, res) => {
    try {
        const response = await profileService.createFreelancerProfile(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create freelancer profile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create freelancer profile ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const createClientProfile = async (req, res) => {
    try {
        const response = await profileService.createClientProfile(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create client profile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create client profile ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const createAgencyProfile = async (req, res) => {
    try {
        const response = await profileService.createAgencyProfile(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create agency profile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create agency profile ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const filterProfiles = async (req, res) => {
    try {
        const response = await profileService.filterProfiles(req.query, res);
        logger.info(`${messageConstants.RESPONSE_FROM} filter profiles API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Filter profiles ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    createFreelancerProfile,
    createClientProfile,
    createAgencyProfile,
    filterProfiles
}