const FreelancerProfileSchema = require('../../models/freelancer_profile');
const ClientProfileSchema = require('../../models/client_profile');
const AgencyProfileSchema = require('../../models/agency_profile');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const createFreelancerProfile = async (body, userDetails, res) => {
    return new Promise(async () => {
        if (userDetails?.role !== 1) {
            logger.error(messageConstants.OPERATION_NOT_PERMITTED);
            return responseData.fail(res, messageConstants.OPERATION_NOT_PERMITTED, 400);
        };

        await FreelancerProfileSchema.findOne({ user_id: userDetails?._id }).then(async (result) => {
            if (result) {
                logger.error(messageConstants.PROFILE_ALREADY_EXISTS);
                return responseData.fail(res, messageConstants.PROFILE_ALREADY_EXISTS, 400);
            }

            body['user_id'] = userDetails?._id;
            body['firstname'] = userDetails?.firstname;
            body['lastname'] = userDetails?.lastname;
            body['email'] = userDetails?.email;
            const newProfile = new FreelancerProfileSchema(body);
            await newProfile.save().then((result) => {
                logger.info(messageConstants.PROFILE_CREATED);
                return responseData.success(res, result, messageConstants.PROFILE_CREATED);
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
        });
    })
}

const createClientProfile = async (body, userDetails, res) => {
    return new Promise(async () => {
        if (userDetails?.role !== 2) {
            logger.error(messageConstants.OPERATION_NOT_PERMITTED);
            return responseData.fail(res, messageConstants.OPERATION_NOT_PERMITTED, 400);
        };

        await ClientProfileSchema.findOne({ user_id: userDetails?._id }).then(async (result) => {
            if (result) {
                logger.error(messageConstants.PROFILE_ALREADY_EXISTS);
                return responseData.fail(res, messageConstants.PROFILE_ALREADY_EXISTS, 400);
            };

            body['user_id'] = userDetails?._id;
            body['firstname'] = userDetails?.firstname;
            body['lastname'] = userDetails?.lastname;
            body['email'] = userDetails?.email;
            const newProfile = new ClientProfileSchema(body);
            await newProfile.save().then((result) => {
                logger.info(messageConstants.PROFILE_CREATED);
                return responseData.success(res, result, messageConstants.PROFILE_CREATED);
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
        });
    })
}

const createAgencyProfile = async (body, userDetails, res) => {
    return new Promise(async () => {
        if (userDetails?.role !== 3) {
            logger.error(messageConstants.OPERATION_NOT_PERMITTED);
            return responseData.fail(res, messageConstants.OPERATION_NOT_PERMITTED, 400);
        };

        await AgencyProfileSchema.findOne({ user_id: userDetails?._id }).then(async (result) => {
            if (result) {
                logger.error(messageConstants.PROFILE_ALREADY_EXISTS);
                return responseData.fail(res, messageConstants.PROFILE_ALREADY_EXISTS, 400);
            };

            body['user_id'] = userDetails?._id;
            body['firstname'] = userDetails?.firstname;
            body['lastname'] = userDetails?.lastname;
            body['email'] = userDetails?.email;
            const newProfile = new AgencyProfileSchema(body);
            await newProfile.save().then((result) => {
                logger.info(messageConstants.PROFILE_CREATED);
                return responseData.success(res, result, messageConstants.PROFILE_CREATED);
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
        });
    })
}

module.exports = {
    createFreelancerProfile,
    createClientProfile,
    createAgencyProfile
}