const mongoose = require('mongoose');
const { logger } = require('../utils');
const { messageConstants } = require('../constants');

const connectDb = async () => {
    try {
        var dbURI = process.env.DB_URL;
        let connection = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        logger.info(`Database ${messageConstants.CONNECTED_SUCCESSFULLY}`);
    } catch (error) {
        process.exit(1)
    }
};

module.exports = connectDb;