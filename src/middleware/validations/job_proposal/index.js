const Joi = require('joi');
const { validateRequest } = require('../validate-request');
const { EstimatedTime } = require('../../../constants');


const jobProposalValidation = (req, res, next) => {
    const schema = Joi.object({
        job_id: Joi.string().required(),
        amount: Joi.number().required(),
        duration: Joi.string().valid(...Object.values(EstimatedTime)).optional(),  
        attechment_id: Joi.array().items(Joi.string()).optional(),
        cover_letter: Joi.string().required(), 
    })
    validateRequest(req.body, res, schema, next)
}

module.exports = {
    jobProposalValidation,
}