const express = require('express');
const api = express.Router();

const routes = [
    `auth`,
    `user`,
    `profile`,
    `job`,
];

routes.forEach((route) => require(`./${route}`)(api));

module.exports = api;