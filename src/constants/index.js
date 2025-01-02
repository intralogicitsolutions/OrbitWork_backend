const messageConstants = require('./messages');
const urlConstants = require('./url');
const responseData = require('./response');
const { mailSubjectConstants, mailTemplateConstants } = require('./mail');
const { UserRole, Status } = require('./enum');

module.exports = {
    messageConstants,
    urlConstants,
    responseData,
    mailSubjectConstants,
    mailTemplateConstants,
    UserRole,
    Status
}