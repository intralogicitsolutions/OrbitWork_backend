const userService = require('../../services/user');
const { logger } = require('../../utils');
const { messageConstants } = require('../../constants');

const getUsersList = async (req, res) => {
    try {
        const response = await userService.getUsersList(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get users list API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get user list ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const deleteUser = async (req, res) => {
    try {
        const response = await userService.deleteUser(req?.userDetails?._id, res);
        logger.info(`${messageConstants.RESPONSE_FROM} delete user API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Delete user ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    getUsersList,
    deleteUser
}