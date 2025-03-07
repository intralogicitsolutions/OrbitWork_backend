const FreelancerProfileSchema = require('../../models/freelancer_profile');
const ClientProfileSchema = require('../../models/client_profile');
const AgencyProfileSchema = require('../../models/agency_profile');
const UserSchema = require('../../models/user');
const { responseData, messageConstants, Status, UserTypes, FilterTypes, Tags, UserRole } = require('../../constants');
const { logger } = require('../../utils');
const { cryptoGraphy } = require('../../middleware');

const createFreelancerProfile = async (body, userDetails, res) => {
    return new Promise(async () => {
        if (userDetails?.role !== UserTypes.FREELANCER) {
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
        if (userDetails?.role !== UserTypes.CLIENT) {
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
        if (userDetails?.role !== UserTypes.FREELANCER) {
            logger.error(messageConstants.OPERATION_NOT_PERMITTED);
            return responseData.fail(res, messageConstants.OPERATION_NOT_PERMITTED, 400);
        };

        await AgencyProfileSchema.findOne({ freelancer_id: userDetails?._id }).then(async (result) => {
            if (result) {
                logger.error(messageConstants.PROFILE_ALREADY_EXISTS);
                return responseData.fail(res, messageConstants.PROFILE_ALREADY_EXISTS, 400);
            };

            const password = await cryptoGraphy.hashPassword(body?.password);

            const userBody = {
                firstname: body?.firstname,
                lastname: body?.lastname,
                email: body?.email,
                role: UserRole.AGENCY,
                password
            };

            const newUser = new UserSchema(userBody);
            const userData =  await newUser.save();

            body['user_id'] = userData?._id;
            body['firstname'] = userData?.firstname;
            body['lastname'] = userData?.lastname;
            body['email'] = userData?.email;
            body['freelancer_id'] = userDetails?._id;

            const newProfile = new AgencyProfileSchema(body);
            await newProfile.save().then((result) => {
                logger.info(messageConstants.PROFILE_CREATED);
                return responseData.success(res, result, messageConstants.PROFILE_CREATED);
            }).catch((err) => {
                console.log(err)
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
        });
    })
}

const filterProfiles = async (body, res) => {
    return new Promise(async () => {
        const { searchQuery, filterType } = body;
        if (filterType == FilterTypes.JOB) {
            const query = {
                $or: [
                    { firstname: { $regex: searchQuery, $options: 'i' } },
                    { lastname: { $regex: searchQuery, $options: 'i' } },
                ],
                is_deleted: false,
                status: Status.ACTIVE
            };

            const result = await ClientProfileSchema.find(query);

            logger.info(messageConstants.FILTERED_PROFILES_FETCHED);
            return responseData.success(res, result || [], messageConstants.FILTERED_PROFILES_FETCHED);
        } else if (filterType == FilterTypes.TALENT) {
            const query = {
                $or: [
                    { firstname: { $regex: searchQuery, $options: 'i' } },
                    { lastname: { $regex: searchQuery, $options: 'i' } },
                    { skills: { $regex: searchQuery, $options: 'i' } }
                ],
                is_deleted: false,
                status: Status.ACTIVE
            };

            const freeLancerProfiles = await FreelancerProfileSchema.find(query).then((result) => {
                result = result?.map((e) => {
                    e._doc['profile_tag'] = Tags.FREELANCER;
                    return e;
                });
                return result || [];
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });

            const agencyProfiles = await AgencyProfileSchema.find(query).then((result) => {
                result = result?.map((e) => {
                    e._doc['profile_tag'] = Tags.AGENCY
                    return e;
                });
                return result || [];
            }).catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            });

            const result = freeLancerProfiles?.concat(agencyProfiles) || [];

            logger.info(messageConstants.FILTERED_PROFILES_FETCHED);
            return responseData.success(res, result, messageConstants.FILTERED_PROFILES_FETCHED);
        } else if (filterType == FilterTypes.PROJECT) {
            logger.info(messageConstants.FILTERED_PROFILES_FETCHED);
            return responseData.success(res, [], messageConstants.FILTERED_PROFILES_FETCHED);
        }

    }).catch((err) => {
        logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
        return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
    })
}

module.exports = {
    createFreelancerProfile,
    createClientProfile,
    createAgencyProfile,
    filterProfiles
}