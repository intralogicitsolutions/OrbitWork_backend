const Joi = require('joi');
const { validateRequest } = require('../validate-request');
const { FilterTypes } = require('../../../constants/enum');

const createFreelancerProfileValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional().pattern(/^[+]?[0-9\s\(\)\-\+]+$/),
        profile_picture: Joi.string().uri().optional(),
        location: Joi.object({
            city: Joi.string().optional(),
            country: Joi.string().optional()
        }).optional(),
        professional_title: Joi.string().min(1).required(),
        bio: Joi.string().optional(),
        skills: Joi.array().items(Joi.string()).optional(),
        experience_years: Joi.number().integer().optional(),
        portfolio: Joi.object({
            website: Joi.string().uri().optional(),
            github: Joi.string().uri().optional(),
            dribbble: Joi.string().uri().optional(),
            behance: Joi.string().uri().optional(),
            other: Joi.array().items(Joi.string().uri()).optional()
        }).optional(),
        certifications: Joi.array().items(
            Joi.object({
                name: Joi.string().min(1).required(),
                issuer: Joi.string().min(1).required(),
                date: Joi.date().optional()
            })
        ).optional(),
        services_offered: Joi.array().items(Joi.string()).optional(),
        availability: Joi.object({
            type: Joi.string().valid('Full-time', 'Part-time', 'Project-based').optional(),
            timezone: Joi.string().optional()
        }).optional(),
        languages_spoken: Joi.array().items(Joi.string()).optional(),
        hourly_rate: Joi.number().optional(),
        previous_projects: Joi.array().items(
            Joi.object({
                title: Joi.string().min(1).optional(),
                description: Joi.string().optional(),
                client: Joi.string().optional(),
                date: Joi.date().optional(),
                url: Joi.string().uri().optional()
            })
        ).optional(),
        payment_details: Joi.object({
            method: Joi.string().optional(),
            account_info: Joi.string().optional()
        }).optional()
    });
    validateRequest(req.body, res, schema, next)
}

const createClientProfileValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional().pattern(/^[+]?[0-9\s\(\)\-\+]+$/),
        company: Joi.object({
            name: Joi.string().optional(),
            website: Joi.string().uri().optional(),
            industry: Joi.string().optional()
        }).optional(),
        bio: Joi.string().optional(),
        projects_posted: Joi.number().integer().min(0).required(),
        location: Joi.object({
            city: Joi.string().optional(),
            country: Joi.string().optional()
        }).optional(),
        payment_details: Joi.object({
            method: Joi.string().valid('Credit Card', 'PayPal').optional(),
            account_info: Joi.string().optional() // You may want to mask or encrypt this data
        }).optional(),
        preferences: Joi.object({
            communication: Joi.string().valid('Email', 'Phone').optional(),
            project_type: Joi.string().valid('Hourly', 'Fixed Price').optional()
        }).optional()
    });
    validateRequest(req.body, res, schema, next)
}

const createAgencyProfileValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone: Joi.string().optional().pattern(/^[+]?[0-9\s\(\)\-\+]+$/),
        agency_name: Joi.string().required(),
        agency_website: Joi.string().uri().optional(),
        agency_description: Joi.string().optional(),
        team_size: Joi.number().integer().optional(),
        location: Joi.object({
            city: Joi.string().optional(),
            country: Joi.string().optional()
        }).optional(),
        industries_served: Joi.array().items(Joi.string()).optional(),
        services_offered: Joi.array().items(Joi.string()).optional(),
        certifications: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            issuer: Joi.string().required(),
            date: Joi.date().required()
        })).optional(),
        portfolio: Joi.object({
            website: Joi.string().uri().optional(),
            github: Joi.string().uri().optional(),
            other: Joi.array().items(Joi.string()).optional()
        }).optional(),
        clients: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            industry: Joi.string().required(),
            project_description: Joi.string().optional(),
            date: Joi.date().required()
        })).optional()
    });
    validateRequest(req.body, res, schema, next)
}

const filterProfilesValidation = (req, res, next) => {
    const schema = Joi.object({
        searchQuery: Joi.string(),
        filterType: Joi.number().valid(FilterTypes.JOB, FilterTypes.TALENT, FilterTypes.PROJECT)
    });
    validateRequest(req.query, res, schema, next)
}



module.exports = {
    createFreelancerProfileValidation,
    createClientProfileValidation,
    createAgencyProfileValidation,
    filterProfilesValidation
}