const Joi = require('joi');
const { validateRequest } = require('../validate-request');

const signUpValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.number().required(),
    })
    validateRequest(req.body, res, schema, next)
}
const signInValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    validateRequest(req.body, res, schema, next)
}
const resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required()
    })
    validateRequest(req.body, res, schema, next)
}
const forgotPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required()
    })
    validateRequest(req.body, res, schema, next)
}
const changePasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        new_password: Joi.string().required()
    })
    validateRequest(req.body, res, schema, next)
}


module.exports = {
    signUpValidation,
    signInValidation,
    resetPasswordValidation,
    forgotPasswordValidation,
    changePasswordValidation,
}