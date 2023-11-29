const createHttpError = require('http-errors')
const { HTTP_CODE_ERRORS, VALIDATOR_TYPE } = require('../core/constants')

module.exports = function (type = VALIDATOR_TYPE.BODY, validatorSchema) {
    if (![VALIDATOR_TYPE.BODY, VALIDATOR_TYPE.QUERY].includes(type)) {
        throw new Error(`${type} validator is not exist`)
    }
    return async function (req, res, next) {
        try {
            const validated = await validatorSchema.validateAsync(req[type])
            req[type] = validated
            next()
        } catch (e) {
            if (e.isJoi) {
                return next(
                    createHttpError(HTTP_CODE_ERRORS.SCHEMA_VALIDATION, {
                        message: e.message,
                    })
                )
            }
            next(createHttpError(HTTP_CODE_ERRORS.INTERNAL_SERVER_ERROR))
        }
    }
}
