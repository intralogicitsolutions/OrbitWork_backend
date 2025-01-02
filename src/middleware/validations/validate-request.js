const { logger } = require('../../utils');

const validateRequest = (data, res, schema, next) => {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripeUnknow: true
    }
    const { error, value } = schema.validate(data, options);
    if (error) {
        logger.error(`Validation error: ${error.details.map((x) => x.message.replace(/['"]/g, "")).join(', ')}`);
        res.status(400).send({
            status: 'fail',
            message: `Validation error: ${error.details.map((x) => x.message.replace(/['"]/g, "")).join(', ')}`
        })
    } else {
        data = value;
        next();
    }
}

module.exports = { validateRequest }