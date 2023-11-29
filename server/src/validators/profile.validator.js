const Joi = require('joi')

const profileBodySchema = Joi.object({
    id: Joi.number().required(),
})

module.exports = {
    profileBodySchema,
}
