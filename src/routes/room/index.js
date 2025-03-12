const roomController = require('../../controllers/room');
const { jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.post(urlConstants.CREATE_ROOM, jsonWebToken.validateToken, roomController.createRoom);
}