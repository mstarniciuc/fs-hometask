const Joi = require('joi')

const depositBodySchema = Joi.object({
    amount: Joi.number().min(1).required(),
})

module.exports = {
    depositBodySchema,
}
