const authController = require('../../controllers/auth');
const { jsonWebToken, authValidator } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.post(urlConstants.USER_SIGNUP, authValidator.signUpValidation, authController.signUp);
    app.post(urlConstants.USER_SIGNIN, authValidator.signInValidation, authController.signIn);
};