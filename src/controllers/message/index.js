const messageService = require('../../services/message');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const sendMessage = async (req, res) => {
    try {
        const response = await messageService.sendMessage(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} send message API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Send message ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const getMessage = async (req, res) => {
    try {
        const response = await messageService.getMessage(req.params, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get message API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get message ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

const getMessageList = async (req, res) => {
    try {
        const response = await messageService.getMessageList(req, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get message list API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get Message list ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    sendMessage,
    getMessage,
    getMessageList
}