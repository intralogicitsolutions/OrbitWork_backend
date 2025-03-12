const express = require('express');
const api = express.Router();

const routes = [
    `auth`,
    `user`,
    `profile`,
    `job`,
    `message`,
    `upload_file`,
    `room`
];

routes.forEach((route) => require(`./${route}`)(api));

module.exports = api;