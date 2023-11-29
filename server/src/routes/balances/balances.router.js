const express = require('express')
const Validator = require('../../middleware/validator')

const { balanceDeposit } = require('./balances.controller')
const { getProfile } = require('../../middleware/getProfile')
const { VALIDATOR_TYPE } = require('../../core/constants')
const { depositBodySchema } = require('../../validators/deposit.validator')

// https://${host}/balances/${currentRouter}
const balancesRouter = express.Router()

balancesRouter.post(
    '/deposit/:userId',
    getProfile,
    Validator(VALIDATOR_TYPE.BODY, depositBodySchema),
    balanceDeposit
)

module.exports = balancesRouter
