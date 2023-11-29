const express = require('express')

const Validator = require('../../middleware/validator')
const { getProfiles, loginProfile } = require('./profiles.controller')
const { VALIDATOR_TYPE } = require('../../core/constants')
const { profileBodySchema } = require('../../validators/profile.validator')

// https://${host}/profiles/${currentRouter}
const profilesRouter = express.Router()

profilesRouter.get('/', getProfiles)
profilesRouter.post(
    '/login',
    Validator(VALIDATOR_TYPE.BODY, profileBodySchema),
    loginProfile
)

module.exports = profilesRouter
