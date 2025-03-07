const authService = require('../../services/auth');
const { logger } = require('../../utils');
const { messageConstants } = require('../../constants');

const signUp = async (req, res) => {
    try {
        const response = await authService.signUp(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} signup API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Signup ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const signIn = async (req, res) => {
    try {
        const response = await authService.signIn(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} signin API`, JSON.stringify(response));
        res.send(response)
    } catch (err) {
        logger.error(`Signin ${messageConstants.API_FAILED}`, err);
        res.send(err)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const response = await authService.forgotPassword(req, res, next);
        logger.info(`${messageConstants.RESPONSE_FROM} forgot password API`, JSON.stringify(response));
        res.send(response)
    } catch (err) {
        logger.error(`Forgot password ${messageConstants.API_FAILED}`, err);
        res.send(err)
    }
}

const resetPassword = async (req, res) => {
    try {
        const response = await authService.resetPassword(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} reset password API`, JSON.stringify(response));
        res.send(response)
    } catch (err) {
        logger.error(`Reset password ${messageConstants.API_FAILED}`, err);
        res.send(err)
    }
}

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    resetPassword
}