const roomService = require('../../services/room');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');

const createRoom = async (req, res) => {
    try {
        const response = await roomService.createRoom(req.body, req?.userDetails, res);
        logger.info(`${messageConstants.RESPONSE_FROM} create room API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Create room ${messageConstants.API_FAILED}`, err);
        res.send(err);
    }
}

module.exports = {
    createRoom,
}