const UserSchema = require('../../models/user');
const { responseData, messageConstants, Status } = require('../../constants');
const { logger } = require('../../utils');

const getUsersList = async (body, res) => {
    return new Promise(async () => {
        await UserSchema.find({ status: Status.ACTIVE })
            .select('-password -token')
            .then((result) => {
                logger.info(messageConstants.USERS_FETCHED)
                return responseData.success(res, result, messageConstants.USERS_FETCHED);
            })
            .catch((err) => {
                logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
                return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
            })
    })
}

const deleteUser = async (userId, res) => {
    return new Promise(async () => {
        await UserSchema.findOneAndUpdate({ _id: userId }, { is_deleted: true }, { new: true }).then((result) => {
            logger.info(messageConstants.USER_DELETED)
            return responseData.success(res, result, messageConstants.USER_DELETED);
        }).catch((err) => {
            logger.error(messageConstants.INTERNAL_SERVER_ERROR, err);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR);
        })
    })
}

module.exports = {
    getUsersList,
    deleteUser
}