const express = require('express');
const api = express.Router();

const routes = [
    `auth`,
    `user`,
    `profile`,
    `job`,
    `message`,
    `upload_file`,
    `room`,
    `job_proposal`
];

routes.forEach((route) => require(`./${route}`)(api));

module.exports = api;