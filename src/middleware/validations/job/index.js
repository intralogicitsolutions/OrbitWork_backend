const Joi = require('joi');
const { validateRequest } = require('../validate-request');
const { ProjectType, EstimatedTime } = require('../../../constants');


const jobValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        jobDescription: Joi.string().required(),
        location: Joi.string().required(),
        budget: Joi.number().required(),
        isPaymentVerified: Joi.boolean().required(),
        rating: Joi.number().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        spending: Joi.number().optional(),
        hourlyRateMin: Joi.number().optional(),
        hourlyRateMax: Joi.number().optional(),
        hourlyRateMax: Joi.number().optional(),
        projectType: Joi.string().valid(...Object.values(ProjectType)).optional(),
        estimatedTime: Joi.string().valid(...Object.values(EstimatedTime)).optional(),
        hoursPerWeek: Joi.number().optional(),
        isFixedPrice: Joi.boolean().optional(),
        document_id: Joi.string().optional(),
        proposals: Joi.string().required(), 
    })
    validateRequest(req.body, res, schema, next)
}

module.exports = {
    jobValidation,
}