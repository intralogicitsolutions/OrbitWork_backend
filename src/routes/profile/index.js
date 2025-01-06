const profileController = require('../../controllers/profile');
const { jsonWebToken, profileValidator } = require('../../middleware');
const { urlConstants } = require('../../constants');

module.exports = (app) => {
    app.post(urlConstants.CREATE_FREELANCER_PROFILE, jsonWebToken.validateToken, profileValidator.createFreelancerProfileValidation, profileController.createFreelancerProfile);
    app.post(urlConstants.CREATE_CLIENT_PROFILE, jsonWebToken.validateToken, profileValidator.createClientProfileValidation, profileController.createClientProfile);
    app.post(urlConstants.CREATE_AGENCY_PROFILE, jsonWebToken.validateToken, profileValidator.createAgencyProfileValidation, profileController.createAgencyProfile);
    app.get(urlConstants.FILTER_PROFILES, jsonWebToken.validateToken, profileValidator.filterProfilesValidation, profileController.filterProfiles);

};