const Joi = require('joi')

const adminQuerySchema = Joi.object().keys({
    start: Joi.date().iso().required(),
    end: Joi.date().iso().required(),
    limit: Joi.number().optional(),
})

module.exports = {
    adminQuerySchema,
}
