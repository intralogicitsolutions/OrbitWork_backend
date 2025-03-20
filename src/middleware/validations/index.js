const authValidator = require('./auth');
const profileValidator = require('./profile');
const userValidator = require('./user');
const jobValidator = require('./job');
const jobProfileValidator = require('./job_proposal');

module.exports = {
    authValidator,
    profileValidator,
    userValidator,
    jobValidator,
    jobProfileValidator
}