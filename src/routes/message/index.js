const messageController = require('../../controllers/message');
const { jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.post(urlConstants.SEND_MESSAGE, jsonWebToken.validateToken, messageController.sendMessage);
    app.get(urlConstants.GET_MESSAGE, jsonWebToken.validateToken, messageController.getMessage);
    app.get(urlConstants.MESSAGE_LIST, jsonWebToken.validateToken, messageController.getMessageList);
}