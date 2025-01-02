const userController = require('../../controllers/user');
const { jsonWebToken, userValidator } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.get(urlConstants.GET_USERS_LIST, userController.getUsersList);
    app.delete(urlConstants.DELETE_USER, jsonWebToken.validateToken, userController.deleteUser);
    app.post(urlConstants.FILTER_USERS, jsonWebToken.validateToken, userController.filterUsers);
};