const express = require('express')
const Validator = require('../../middleware/validator')

const { getBestProfession, getBestClients } = require('./admin.controller')
const { VALIDATOR_TYPE } = require('../../core/constants')
const { adminQuerySchema } = require('../../validators/admin.validator')

// https://${host}/admin/${currentRouter}
const adminRouter = express.Router()

adminRouter.get(
    '/best-profession',
    Validator(VALIDATOR_TYPE.QUERY, adminQuerySchema),
    getBestProfession
)
adminRouter.get(
    '/best-clients',
    Validator(VALIDATOR_TYPE.QUERY, adminQuerySchema),
    getBestClients
)

module.exports = adminRouter
