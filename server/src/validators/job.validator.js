const Joi = require('joi')

const jobQuerySchema = Joi.object().keys({
    job_id: Joi.number().required(),
})

module.exports = {
    jobQuerySchema,
}
